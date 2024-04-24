import { describe } from "node:test";
import { AppContext } from "./context";

describe(`Test ${AppContext.name}`, ()=>{

    it('Same instance should be returned', ()=>{
        expect.assertions(1);

        const s1 = AppContext.getInstance();
        const s2 = AppContext.getInstance();

        expect(s1).toEqual(s2)
    })
})