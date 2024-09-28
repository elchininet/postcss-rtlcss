import {
    Comment,
    Container,
    Node,
} from 'postcss';
import { ControlDirective } from '@types';
import { TYPE } from '@constants';
import { getControlDirective } from '@utilities/directives';

type WalkContainerControlDirectiveCallback = (comment: Comment, controlDirective: ControlDirective) => void;
type WalkContainerNodeCallback = (node: Node) => void;

export const walkContainer = (
    container: Container,
    filter: string [],
    directiveCallback: WalkContainerControlDirectiveCallback,
    nodeCallback: WalkContainerNodeCallback
): void => {

    container.each((node: Node): undefined | false => {

        if ( node.type !== TYPE.COMMENT && !filter.includes(node.type) ) return;

        if (node.type === TYPE.COMMENT) {

            const comment = node as Comment;
            const controlDirective = getControlDirective(comment);
            
            if (controlDirective) {
                directiveCallback(comment, controlDirective);
            }

        } else {

            nodeCallback(node);
            
        }

    });

};