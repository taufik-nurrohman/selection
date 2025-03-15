Selection Utility
=================

Usage
-----

### CommonJS

~~~ js
const {getSelection} = require('@taufik-nurrohman/selection');

console.log(getSelection());
~~~

### ECMAScript

~~~ js
import {getSelection} from '@taufik-nurrohman/selection';

console.log(getSelection());
~~~

Methods
-------

### focusTo(node, mode = 1)

### getSelection(node)

### hasSelection(node)

### insertAtSelection(content|node|[node, ...], mode = true)

### letSelection(node)

### restoreSelection(node, store)

### saveSelection(node)

### selectTo(node, mode = true)

### selectToNone()

### setSelection(node, range|[start, end])