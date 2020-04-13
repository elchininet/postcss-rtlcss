import { Container, Node, Comment } from 'postcss';
import { COMMENT_TYPE, IGNORE_MODE, IGNORE_BEGIN, IGNORE_END } from '@constants';
import { getIgnoreComment } from '@utilities/comments';
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
            const ignore = getIgnoreComment(comment);
            
            if (ignore) {
                if (removeComments) {
                    cleanRuleRawsBefore(comment.next());              
                    comment.remove(); 
                }            
                switch (ignore) {
                    case IGNORE_BEGIN:
                        ignoreMode = IGNORE_MODE.BLOCK_MODE;
                        break;
                    case IGNORE_END:
                        ignoreMode = IGNORE_MODE.DISABLED;
                        break;
                    default:
                        ignoreMode = IGNORE_MODE.NEXT_NODE;
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