"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toList = void 0;
function toList(i, trailingConnective = 'and') {
    return `${i.length > 1 ? `${i.slice(0, i.length - 1).join(', ')} ${trailingConnective} ${i[i.length - 1]}` : i}`;
}
exports.toList = toList;
// WIP
