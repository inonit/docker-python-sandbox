# Docker Python sandbox

As its name suggests, this library is a NodeJS sandbox for executing untrusted Python code in Docker containers.

## Usage

This section describes how to use the library from your NodeJS application.

- Install Docker
- Install the library: `npm install docker-python-sandbox`
- Build the Docker image of the sandbox: `cd node_modules/docker-python-sandbox/container && sudo docker build -t docker_sandbox .`

You should then be good to go.

### Example usage

```

```

## How does it work?

The library maintains a fixed-size pool of containers. The containers run a minimalistic API only accessible from the host server, exposing an endpoint to execute code. 

![Schema](https://i.imgur.com/i8O7v2a.png)

- A container is only used once to execute code. It is destroyed afterwards and replaced by a fresh one
- Containers cannot communicate with each other

## IMPORTANT : about security

Please, please, do read this section before using blindly the library.
