#!/bin/bash

idUser=$(<idUser.txt)
idTree=$(<idTree.txt)

for i in {1..100}
do
    # Redirect stdout to dev/null to show nothing
    curl -d '{"idUser": "'$idUser'","idTree": "'$idTree'"}' -H "Content-Type: application/json" -X POST http://192.168.0.22:8080/core/openWorkbench -o /dev/null -s -w "%{time_total} %{size_download}" > 0004kv2-1.D$1.${i}.txt &
done