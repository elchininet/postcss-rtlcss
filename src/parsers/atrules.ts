import{
    Container,
    Node,
    Comment
} from 'postcss';
import { ControlDirective, Parsers } from '@types';
import {
    TYPE,
    KEYFRAMES_NAME,
    CONTROL_DIRECTIVE
} from '@constants';
import { walkContainer } from '@utilities/containers';
import {
    isIgnoreDirectiveInsideAnIgnoreBlock,
    checkDirective,
    getSourceDirectiveValue
} from '@utilities/directives';
import { isAtRule } from '@utilities/predicates';
import { vendor } from '@utilities/vendor';

export const parseAtRules = (
    parsers: Parsers,
    container: Container,
    parentSourceDirective: string = undefined,
    hasParentRule = false
): void => {

    const controlDirectives: Record<string, ControlDirective> = {};

    walkContainer(
        container,
        [ TYPE.AT_RULE, TYPE.RULE ],
        (_comment: Comment, controlDirective: ControlDirective): void => {

            if (isIgnoreDirectiveInsideAnIgnoreBlock(controlDirective, controlDirectives)) {
                return;
            }

            controlDirectives[controlDirective.directive] = controlDirective;

        },
        (node: Node): void => {

            if ( checkDirective(controlDirectives, CONTROL_DIRECTIVE.IGNORE) ) {
                return;
            }
        
            if (!isAtRule(node)) return;

            if (vendor.unprefixed(node.name) === KEYFRAMES_NAME) return;

            const sourceDirectiveValue = getSourceDirectiveValue(
                controlDirectives,
                parentSourceDirective
            );

            if (
                hasParentRule &&
                node.nodes
            ) {
                parsers.parseDeclarations(
                    node,
                    hasParentRule,
                    sourceDirectiveValue,
                    checkDirective(controlDirectives, CONTROL_DIRECTIVE.RULES),
                    checkDirective(controlDirectives, CONTROL_DIRECTIVE.URLS)
                );
            }

            parsers.parseAtRules(
                parsers,
                node,
                parentSourceDirective,
                hasParentRule
            );

            parsers.parseRules(
                parsers,
                node,
                sourceDirectiveValue,
                hasParentRule
            );

        }
    );

};
