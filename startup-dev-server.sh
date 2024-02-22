#!/bin/bash

kill -9 $(lsof -t -i:5173)
kill -9 $(lsof -t -i:8000)

cd backend
poe dev &

cd ../frontend
npm run dev

kill -9 $(lsof -t -i:5173)
kill -9 $(lsof -t -i:8000)
