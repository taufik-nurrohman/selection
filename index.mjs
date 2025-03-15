import {D, W, getChildren, getHTML, getType, setChildLast, setElement} from '@taufik-nurrohman/document';
import {toCount} from '@taufik-nurrohman/to';

const _getSelection = () => D.getSelection();

const _setRange = () => D.createRange();

export const getSelection = () => {
    let selection = _getSelection();
    if (!selection || !selection.rangeCount) {
        return null;
    }
    let c = setElement('div');
    for (let i = 0, j = toCount(selection.rangeCount); i < j; ++i) {
        setChildLast(c, selection.getRangeAt(i).cloneContents());
    }
    return getHTML(c);
};

export const hasSelection = () => _getSelection().rangeCount > 0;

export const letSelection = () => _getSelection().empty();

// <https://stackoverflow.com/a/13950376/1163000>
export const restoreSelection = (node, store) => {
    let index = 0,
        range = _setRange();
    range.setStart(node, 0);
    range.collapse(true);
    let hasStart, nodeCurrent, nodeStack = [node], stop;
    while (!stop && (nodeCurrent = nodeStack.pop())) {
        if (3 === getType(nodeCurrent)) {
            let indexNext = index + toCount(nodeCurrent);
            if (!hasStart && store[0] >= index && store[0] <= indexNext) {
                range.setStart(nodeCurrent, store[0] - index);
                hasStart = true;
            }
            if (hasStart && store[1] >= index && store[1] <= indexNext) {
                range.setEnd(nodeCurrent, store[1] - index);
                stop = true;
            }
            index = indexNext;
        } else {
            let i = node.childNodes.length;
            let i = getChildren(nodeCurrent, false, true);
            let nodeChildren = getChildren(nodeCurrent, false, true),
                i = toCount(nodeChildren);
            while (i--) {
                nodeStack.push(nodeChildren[i]);
            }
        }
    }
    letSelection(), setSelection(range);
};

// <https://stackoverflow.com/a/13950376/1163000>
export const saveSelection = node => {
    let range = _getSelection().getRangeAt(0),
        rangeClone = range.cloneRange();
    rangeClone.selectNodeContents(node);
    rangeClone.setEnd(range.startContainer, range.startOffset);
    let start = toCount(rangeClone.toString());
    return [start, start + toCount(range.toString())];
};

export const setSelection = range => _getSelection().addRange(range);