const {D, W, getChildFirst, getChildren, getHTML, getType, setChildLast, setElement, setHTML} = require('@taufik-nurrohman/document');
const {forEachArray} = require('@taufik-nurrohman/f');
const {isArray, isString} = require('@taufik-nurrohman/is');
const {toCount} = require('@taufik-nurrohman/to');

const _getSelection = () => D.getSelection();

const _setRange = () => D.createRange();

const focusTo = (node, mode, selection) => selectTo(node, mode || 1, selection);

// The `node` parameter is currently not in use
const getSelection = (node, selection) => {
    selection = selection || _getSelection();
    if (!selection.rangeCount) {
        return null;
    }
    let c = setElement('div');
    for (let i = 0, j = toCount(selection.rangeCount); i < j; ++i) {
        setChildLast(c, selection.getRangeAt(i).cloneContents());
    }
    return getHTML(c);
};

// The `node` parameter is currently not in use
const hasSelection = (node, selection) => (selection || _getSelection()).rangeCount > 0;

// <https://stackoverflow.com/a/6691294/1163000>
// The `node` parameter is currently not in use
const insertAtSelection = (node, content, mode, selection) => {
    selection = selection || _getSelection();
    let from, range, to;
    if (selection.rangeCount) {
        range = selection.getRangeAt(0);
        range.deleteContents();
        to = D.createDocumentFragment();
        let nodeCurrent, nodeFirst, nodeLast;
        if (isString(content)) {
            from = setElement('div');
            setHTML(from, content);
            while (nodeCurrent = getChildFirst(from, 1)) {
                nodeLast = setChildLast(to, nodeCurrent);
            }
        } else if (isArray(content)) {
            forEachArray(content, v => (nodeLast = setChildLast(to, v)));
        } else {
            nodeLast = setChildLast(to, content);
        }
        nodeFirst = getChildFirst(to, 1);
        range.insertNode(to);
        if (nodeLast) {
            range = range.cloneRange();
            range.setStartAfter(nodeLast);
            range.setStartBefore(nodeFirst);
            if (1 === mode) {
                range.collapse(true);
            } else if (-1 === mode) {
                range.collapse();
            }
            setSelection(node, range, selectToNone(selection));
        }
    }
    return selection;
};

// The `node` parameter is currently not in use
const letSelection = (node, selection) => {
    selection = selection || _getSelection();
    return selection.empty(), selection;
};

// <https://stackoverflow.com/a/13950376/1163000>
const restoreSelection = (node, store, selection) => {
    let index = 0,
        range = _setRange();
    range.setStart(node, 0);
    range.collapse(true);
    let exit, hasStart, nodeCurrent, nodeStack = [node];
    while (!exit && (nodeCurrent = nodeStack.pop())) {
        if (3 === getType(nodeCurrent)) {
            let indexNext = index + toCount(nodeCurrent);
            if (!hasStart && store[0] >= index && store[0] <= indexNext) {
                range.setStart(nodeCurrent, store[0] - index);
                hasStart = true;
            }
            if (hasStart && store[1] >= index && store[1] <= indexNext) {
                exit = true;
                range.setEnd(nodeCurrent, store[1] - index);
            }
            index = indexNext;
        } else {
            forEachArray(getChildren(nodeCurrent, null, 1), v => nodeStack.push(v));
        }
    }
    return setSelection(node, range, letSelection(node, selection));
};

// <https://stackoverflow.com/a/13950376/1163000>
const saveSelection = (node, selection) => {
    let range = (selection || _getSelection()).getRangeAt(0),
        rangeClone = range.cloneRange();
    rangeClone.selectNodeContents(node);
    rangeClone.setEnd(range.startContainer, range.startOffset);
    let start = toCount(rangeClone.toString());
    return [start, start + toCount(range.toString())];
};

const selectTo = (node, mode, selection) => {
    selection = selection || _getSelection();
    letSelection(node, selection);
    let range = _setRange();
    range.selectNodeContents(node);
    selection = setSelection(node, range, selection);
    if (1 === mode) {
        selection.collapseToEnd();
    } else if (-1 === mode) {
        selection.collapseToStart();
    } else {
        // Select all
    }
};

const selectToNone = selection => {
    selection = (selection || _getSelection());
    // selection.removeAllRanges();
    if (selection.rangeCount) {
        selection.removeRange(selection.getRangeAt(0));
    }
    return selection;
};

// The `node` parameter is currently not in use
const setSelection = (node, range, selection) => {
    selection = selection || _getSelection();
    if (isArray(range)) {
        return restoreSelection(node, range, selection);
    }
    return selection.addRange(range), selection;
};

Object.assign(exports, {
    focusTo,
    getSelection,
    hasSelection,
    insertAtSelection,
    letSelection,
    restoreSelection,
    saveSelection,
    selectTo,
    selectToNone,
    setSelection
});