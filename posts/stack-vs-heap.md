---
slug: stack-vs-heap
title: Stack vs. Heap: What Finally Made It Click
category: C++
date: August 10, 2026
readTime: 6 min read
excerpt: Working through 42’s Zombie exercises with new and delete, until the difference between stack and heap stopped being a rule to memorize and started being a picture in my head.
---

I've been working through 42's C++ curriculum, including the Zombie exercise series, and for a while "stack vs. heap" was just a rule I applied without really seeing it: local variables go on the stack, `new` puts things on the heap, don't forget `delete`. It worked, mechanically, until I actually needed a mental picture of what was happening.

## The picture that finally worked

The stack is a tidy, fixed-size structure tied to function calls — every variable declared inside a function lives there, and the moment that function returns, all of it is cleaned up automatically, in order. The heap is the opposite: unstructured memory that only gets allocated and freed when you explicitly ask for it, and that survives long after the function that created it has returned.

:::diagram stackHeapSVG
A stack-allocated object is cleaned up automatically. A heap-allocated one needs an explicit delete.
:::

To make this concrete, I stopped using the exercise's own classes for practice and wrote a small unrelated one instead, since re-using the actual assignment code makes it too easy to pattern-match instead of understand:

```cpp
#include <iostream>
#include <string>

class Creature {
public:
    Creature(const std::string& name) : name_(name) {
        std::cout << name_ << " has entered the stack.\n";
    }
    ~Creature() {
        std::cout << name_ << " has left the stack.\n";
    }
private:
    std::string name_;
};

int main() {
    Creature onStack("Whiskers");             // lives on the stack
    Creature* onHeap = new Creature("Mochi");  // lives on the heap

    delete onHeap;  // must be freed manually
    return 0;       // onStack is destroyed automatically here
}
```

Watching "Whiskers" get destroyed automatically at the end of `main()`, while "Mochi" only disappears at the exact line I call `delete`, made the distinction click in a way that reading the rule never did.

## Where this bit me

> The compiler will happily let you forget a delete. It will not remind you, and it will not care.

A few pointer-syntax habits I had to actively build:

- Every `new` needs exactly one matching `delete` — not more, not fewer.
- Arrays allocated with `new[]` must be freed with `delete[]`, never plain `delete`.
- A pointer doesn't become "safe" after `delete` — it's dangling until you set it to `nullptr` yourself.

| Property | Stack | Heap |
| -------- | ----- | ---- |
| Lifetime | Ends with the scope | Until you delete it |
| Size limit | Small, fixed | Large, flexible |
| Speed | Very fast | Slower, more bookkeeping |
| Cleanup | Automatic | Manual |

None of this is new information to anyone who's used C++ for a while — but it's the kind of thing that has to be rebuilt as intuition, not just memorized as a rule, before constructor design and resource management start making real sense.
