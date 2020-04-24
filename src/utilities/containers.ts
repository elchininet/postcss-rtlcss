import { Container, Node, Comment } from 'postcss';
import { ControlDirective, ObjectWithProps } from '@types';
import { COMMENT_TYPE, CONTROL_DIRECTIVE, CONTROL_DIRECTIVE_BLOCK } from '@constants';
import { getControlDirective, resetDirective } from '@utilities/directives';
import { cleanRuleRawsBefore } from '@utilities/rules';

type WalkContainerCallback = (node: Node, containerDirectives?: ObjectWithProps<ControlDirective>) => void;

export const walkContainer = (
    container: Container,
    filter: string [],
    removeComments: boolean,
    callback: WalkContainerCallback
): void => {

    let controlDirective: ControlDirective;

    const containerDirectives: ObjectWithProps<ControlDirective> = {};

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

                containerDirectives[controlDirective.directive] = { ...controlDirective };

                controlDirective = null;
                
                return;
            }

        } else {

            const IGNORE = containerDirectives[CONTROL_DIRECTIVE.IGNORE];

            if (IGNORE && IGNORE.directive) {
                const { block } = IGNORE;
                resetDirective(IGNORE);
                if (block !== CONTROL_DIRECTIVE_BLOCK.END) {
                    return;
                }
            }

            callback(node, containerDirectives);

        }

    });

};