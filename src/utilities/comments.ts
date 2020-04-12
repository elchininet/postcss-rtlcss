import { Comment } from 'postcss';
import {
    RTL_COMMENT_IGNORE_REGEXP,
    IGNORE_NEXT,
    IGNORE_BEGIN,
    IGNORE_END
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