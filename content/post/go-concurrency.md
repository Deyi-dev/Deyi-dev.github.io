+++
title = "Go Concurrency Patterns I Actually Use"
date = "2026-03-08"
description = "A practical look at goroutines, channels, and when to use each."
tags = ["go", "concurrency", "backend"]
categories = ["Engineering"]
series = ["Go Notes"]
author = "Deyi"
+++

Go's concurrency model is one of the things that made me fall in love with the language. But it's easy to reach for the wrong tool. Here's what I actually use day to day.

<!--more-->

## Goroutines are cheap, but not free

Spawning a goroutine is cheap — around 2KB of stack. But unbounded goroutine creation will still kill you.

```go
// Bad: no limit on concurrent goroutines
for _, item := range items {
    go process(item)
}

// Better: use a semaphore
sem := make(chan struct{}, 10)
for _, item := range items {
    sem <- struct{}{}
    go func(i Item) {
        defer func() { <-sem }()
        process(i)
    }(item)
}
```

## Channels for signaling, not just data

Most people learn channels as a queue. But they're great for signaling too.

```go
done := make(chan struct{})

go func() {
    doWork()
    close(done)
}()

<-done // wait for completion
```

## sync.WaitGroup for fan-out

When you have N workers and need to wait for all of them:

```go
var wg sync.WaitGroup

for _, item := range items {
    wg.Add(1)
    go func(i Item) {
        defer wg.Done()
        process(i)
    }(item)
}

wg.Wait()
```

## When to use mutex vs channel

A rough rule: use a mutex when protecting shared state, use a channel when passing ownership of data.

That's most of what you need for 90% of real-world Go concurrency.
