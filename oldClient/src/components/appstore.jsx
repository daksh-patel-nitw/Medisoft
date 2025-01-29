import Create from 'zustand';
import {persist} from'zustand/middleware';

let appStore=(set)=>({
    dopen:true,
    updateOpen:(doopen)=>set((state)=>({doopen:doopen}))
})
appStore=persist(appStore,{name:'medisoft'});
export const useAppstore= Create(appStore);