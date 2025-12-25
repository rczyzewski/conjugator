import fetchFromJsonDb, { getFetchPages } from "./VerbsService"
import { describe, it, expect } from "vitest";


describe("VerbsService", () => {

it("Testing getting URLs", ()=>{
  expect( getFetchPages(0,100)).toStrictEqual({ skip: 0, take: 100, pages: [1]})
  expect( getFetchPages(1,100)).toStrictEqual({ skip: 1, take: 99, pages: [1]})
  expect( getFetchPages(100,100)).toStrictEqual({ skip: 0, take: 0, pages: []})
  expect( getFetchPages(0,15)).toStrictEqual({ skip: 0, take: 15, pages: [1]})
  expect( getFetchPages(11,15)).toStrictEqual({ skip: 11, take: 4, pages: [1]})
  expect( getFetchPages(11,111)).toStrictEqual({ skip: 11, take: 100, pages: [1,2]})
  expect( getFetchPages(11,211)).toStrictEqual({ skip: 11, take: 200, pages: [1,2,3]})
})

it("testing fetching", async () => {
  let l = await fetchFromJsonDb(1, 2);
  let b = await fetchFromJsonDb(2, 3);
  let c = await fetchFromJsonDb(1, 3);

  expect([...l, ...b]).toStrictEqual(c);
});


});
