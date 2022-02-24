import { atom } from "recoil";

export const modalAtom = atom({
    key: 'modalState',
    default: false
})

export const postIdAtom = atom({
    key: 'postIdState',
    default: ""
})

export const commentIdAtom = atom({
    key: 'commentIdState',
    default: ""
})

export const commentModalAtom = atom({
    key: 'commentModalAtom',
    default: false
})