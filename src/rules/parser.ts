import { Root, Comment, Node, Rule } from 'postcss';
import { RulesObject, PluginOptionsParsed, Mode } from '@types';
import { COMMENT_TYPE, IGNORE_MODE, IGNORE_BEGIN, IGNORE_END, RULE_TYPE } from '@constants';
import { getIgnoreComment } from '@utilities/comments';
import { cleanRuleBefore } from '@utilities/rules';
import { insertCombinedRules } from './rules-combined';
import { insertOverrideRules } from './rules-override';

export const parseRules = (css: Root, options: PluginOptionsParsed): RulesObject[] => {
    
    const appends: RulesObject[] = [];
    let ignoreMode = IGNORE_MODE.DISABLED;

    css.each((node: Node): undefined | false => {
        
        if ( node.type !== COMMENT_TYPE && node.type !== RULE_TYPE ) return;

        if (node.type === COMMENT_TYPE) {

            const comment = node as Comment;
            const ignore = getIgnoreComment(comment);
            
            if (ignore) {
                cleanRuleBefore(comment.next());
                comment.remove();             
                switch (ignore) {
                    case IGNORE_BEGIN:
                        ignoreMode = IGNORE_MODE.BLOCK_MODE;
                        break;
                    case IGNORE_END:
                        ignoreMode = IGNORE_MODE.DISABLED;
                        break;
                    default:
                        ignoreMode = IGNORE_MODE.NEXT_RULE;
                        break;
                }
                return;
            }

        }

        if (node.type === RULE_TYPE) {

            if (ignoreMode === IGNORE_MODE.NEXT_RULE) {                
                ignoreMode = IGNORE_MODE.DISABLED;
                return;
            }

            if (ignoreMode === IGNORE_MODE.BLOCK_MODE) {
                return;
            }

            const rule = node as Rule;

            if (options.mode == Mode.combined) {
                insertCombinedRules(appends, rule, options);
            }
            if (options.mode === Mode.override) {
                insertOverrideRules(appends, rule, options);
            }            

        }

    });

    return appends;

}; 