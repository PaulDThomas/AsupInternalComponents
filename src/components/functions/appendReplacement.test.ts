// import { AioReplacement } from '../aio';
// import { appendReplacement } from './appendReplacement';

// test('Check appendReplacement', () => {
//   let a: AioReplacement = { oldText: "a", newText: ["a1", "a2"], subLists: undefined, };
//   let b: AioReplacement = {
//     oldText: "b", newText: ["b1", "b2"], subLists: [
//       { oldText: "c", newText: ["c1", "c2"] },
//       { oldText: "d", newText: ["d1", "d2"] }
//     ]
//   };

//   // Basic check
//   expect(appendReplacement(a, undefined)).toEqual([a]);
//   expect(appendReplacement(b, undefined)).toEqual([b]);

//   // Check append each way
//   expect(appendReplacement(b, [a])).toEqual([
//     {
//       oldText: "a", newText: ["a1", "a2"], subLists: [
//         {
//           oldText: "b", newText: ["b1", "b2"], subLists: [
//             { oldText: "c", newText: ["c1", "c2"] },
//             { oldText: "d", newText: ["d1", "d2"] }
//           ]
//         }
//       ]
//     }
//   ])

//   expect(appendReplacement(a, [b])).toEqual([
//     {
//       oldText: "b", newText: ["b1", "b2"], subLists: [
//         {
//           oldText: "c", newText: ["c1", "c2"], subLists: [
//             { oldText: "a", newText: ["a1", "a2"] }
//           ]
//         },
//         {
//           oldText: "d", newText: ["d1", "d2"], subLists: [
//             { oldText: "a", newText: ["a1", "a2"] }
//           ]
//         }
//       ]
//     }
//   ])

//   expect(appendReplacement(b, [b])).toEqual([
//     {
//       oldText: "b", newText: ["b1", "b2"], subLists: [
//         {
//           oldText: "c", newText: ["c1", "c2"], subLists: [
//             {
//               oldText: "b", newText: ["b1", "b2"], subLists: [
//                 { oldText: "c", newText: ["c1", "c2"] },
//                 { oldText: "d", newText: ["d1", "d2"] }
//               ]
//             }
//           ]
//         },
//         {
//           oldText: "d", newText: ["d1", "d2"], subLists: [
//             {
//               oldText: "b", newText: ["b1", "b2"], subLists: [
//                 { oldText: "c", newText: ["c1", "c2"] },
//                 { oldText: "d", newText: ["d1", "d2"] }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ])

// })