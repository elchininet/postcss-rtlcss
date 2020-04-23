import { Container, Node, Comment } from 'postcss';
import { ControlDirective } from '@types';
import { COMMENT_TYPE, CONTROL_DIRECTIVE, CONTROL_DIRECTIVE_BLOCK } from '@constants';
import { getControlDirective } from '@utilities/comments';
import { cleanRuleRawsBefore } from '@utilities/rules';

type WalkContainerCallback = (node: Node) => void;

export const walkContainer = (
    container: Container,
    filter: string [],
    removeComments: boolean,
    callback: WalkContainerCallback
): void => {

    let controlDirective: ControlDirective;

    container.each((node: Node): undefined | false => {

        if ( node.type !== COMMENT_TYPE && !filter.includes(node.type) ) return;

        if (node.type === COMMENT_TYPE) {

            const comment = node as Comment;
            controlDirective = getControlDirective(comment);
            
            if (controlDirective) {
                
                if (removeComments) {
                    cleanRuleRawsBefore(comment.next());              
                    comment.remove(); 
                }
                
                return;
            }

        } else {

            if (controlDirective) {

                const { directive, block } = controlDirective;

                if (block !== CONTROL_DIRECTIVE_BLOCK.BEGIN) {
                    controlDirective = null;
                }

                if (
                    directive === CONTROL_DIRECTIVE.IGNORE &&
                    block !== CONTROL_DIRECTIVE_BLOCK.END
                ) {
                    return;
                }

            }

            callback(node);

        }

    });

};