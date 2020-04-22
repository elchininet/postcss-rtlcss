import { Container, Node, Comment } from 'postcss';
import { COMMENT_TYPE, IGNORE_MODE, CONTROL_DIRECTIVE, CONTROL_DIRECTIVE_BLOCK } from '@constants';
import { getControlDirective } from '@utilities/comments';
import { cleanRuleRawsBefore } from '@utilities/rules';

type WalkContainerCallback = (node: Node) => void;

export const walkContainer = (
    container: Container,
    filter: string [],
    removeComments: boolean,
    callback: WalkContainerCallback
): void => {

    let ignoreMode = IGNORE_MODE.DISABLED;

    container.each((node: Node): undefined | false => {

        if ( node.type !== COMMENT_TYPE && !filter.includes(node.type) ) return;

        if (node.type === COMMENT_TYPE) {

            const comment = node as Comment;
            const controlDirective = getControlDirective(comment);
            
            if (controlDirective) {
                
                if (removeComments) {
                    cleanRuleRawsBefore(comment.next());              
                    comment.remove(); 
                }

                switch (controlDirective.directive) {
                    case CONTROL_DIRECTIVE.IGNORE:
                        switch(controlDirective.block) {
                            case CONTROL_DIRECTIVE_BLOCK.BEGIN:
                                ignoreMode = IGNORE_MODE.BLOCK_MODE;
                                break;
                            case CONTROL_DIRECTIVE_BLOCK.END:
                                ignoreMode = IGNORE_MODE.DISABLED;
                                break;
                            default:
                                ignoreMode = IGNORE_MODE.NEXT_NODE;
                        }
                        break;
                }
                return;
            }

        } else {

            if (ignoreMode === IGNORE_MODE.NEXT_NODE) {                
                ignoreMode = IGNORE_MODE.DISABLED;
                return;
            }

            if (ignoreMode === IGNORE_MODE.BLOCK_MODE) {
                return;
            }

            callback(node);

        }

    });

};