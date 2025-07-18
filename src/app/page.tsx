"use client";
import { useState, useRef } from "react";

// export default function Home() {
//   const [count, setCount] = useState(0);
//   return (
//     <div>
//       <h1 className="text-4xl pb-4 font-bold">Landing page</h1>
//       <p>{count}</p>
//       <button
//         className="bg-amber-600 p-4 border-amber-700 border"
//         onClick={() => setCount(count + 1)}
//       >
//         click to +1
//       </button>
//     </div>
//   );
// }

export default function Home() {
  const [seconds, setSeconds] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function startTimer() {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }

  return <div>{seconds} seconds</div>;
}
