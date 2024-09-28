import {
    Comment,
    Container,
    Node
} from 'postcss';
import { ControlDirective } from '@types';
import { getControlDirective } from '@utilities/directives';
import { isComment } from '@utilities/predicates';

type WalkContainerControlDirectiveCallback = (comment: Comment, controlDirective: ControlDirective) => void;
type WalkContainerNodeCallback = (node: Node) => void;

export const walkContainer = (
    container: Container,
    filter: string [],
    directiveCallback: WalkContainerControlDirectiveCallback,
    nodeCallback: WalkContainerNodeCallback
): void => {

    container.each((node: Node): undefined | false => {

        if ( !isComment(node) && !filter.includes(node.type) ) return;

        if (isComment(node)) {

            const controlDirective = getControlDirective(node);
            
            if (controlDirective) {
                directiveCallback(node, controlDirective);
            }

        } else {

            nodeCallback(node);
            
        }

    });

};