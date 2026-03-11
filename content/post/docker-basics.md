+++
title = "Docker Concepts That Finally Clicked"
date = "2026-02-20"
description = "The mental models that made Docker make sense."
tags = ["docker", "devops", "infrastructure"]
categories = ["Engineering"]
author = "Deyi"
+++

I used Docker for months before I actually understood it. Here are the concepts that finally made it click.

<!--more-->

## Image vs Container

An **image** is a blueprint. A **container** is a running instance of that blueprint.

```
Image  →  like a class
Container  →  like an object (instance)
```

You can run many containers from the same image.

## Layers

Every instruction in a Dockerfile creates a layer. Layers are cached.

```dockerfile
FROM golang:1.22          # layer 1
WORKDIR /app              # layer 2
COPY go.mod go.sum ./     # layer 3  ← cache this separately
RUN go mod download       # layer 4  ← expensive, cache it
COPY . .                  # layer 5
RUN go build -o server .  # layer 6
```

Put things that change least at the top. `COPY . .` should be near the bottom — your source code changes on every build.

## Volumes vs Bind Mounts

- **Bind mount**: maps a host path into the container. Good for development.
- **Volume**: managed by Docker. Good for production data persistence.

```bash
# bind mount (dev)
docker run -v $(pwd):/app myimage

# named volume (prod)
docker run -v mydata:/data myimage
```

## Multi-stage builds

Keep your final image small by building in one stage and copying only the output:

```dockerfile
FROM golang:1.22 AS builder
WORKDIR /app
COPY . .
RUN go build -o server .

FROM alpine:latest
COPY --from=builder /app/server /server
ENTRYPOINT ["/server"]
```

The final image only contains the binary — no Go toolchain, no source code.
