import { Comment, Rule, Node } from 'postcss';
import {
    COMMENT_TYPE,
    DECLARATION_TYPE,
    RTL_COMMENT_REGEXP,
    RTL_COMMENT_IGNORE_REGEXP,
    IGNORE_NEXT,
    IGNORE_BEGIN,
    IGNORE_END,
} from '@constants';

export const getIgnoreComment = (comment: Comment): string | null => {
    const commentStr = comment.toString();
    if (RTL_COMMENT_IGNORE_REGEXP.test(commentStr)) {
        const ignore = commentStr.replace(RTL_COMMENT_IGNORE_REGEXP, '$1');
        if (ignore && (ignore === IGNORE_BEGIN || ignore === IGNORE_END)) {
            return ignore;
        } else if (ignore === '') {
            return IGNORE_NEXT;
        }
    }
    return null;
};

export const removeRTLComments = (rule: Rule): void => {
    rule.walk((node: Node): void => {
        if (node.type === COMMENT_TYPE) {
            if (RTL_COMMENT_REGEXP.test(node.toString())) {
                node.remove();
            }
        }
        if (node.type === DECLARATION_TYPE) {
            // @ts-ignore
            if (node.raws && node.raws.value && RTL_COMMENT_REGEXP.test(node.raws.value.raw)) {
                // @ts-ignore
                delete node.raws.value;
                node.value = node.value.trim();
            }
        }
    });
};