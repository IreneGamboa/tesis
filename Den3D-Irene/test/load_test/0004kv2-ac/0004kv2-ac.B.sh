#!/bin/bash

idUser=$(<idUser.txt)
idTree=$(<idTree.txt)

for i in {1..10}
do
    # Redirect stdout to dev/null to show nothing
    curl -d '{"idUser": "'$idUser'","idTree": "'$idTree'"}' -H "Content-Type: application/json" -X POST http://192.168.0.22:8080/core/openWorkbench -o /dev/null -s -w "%{time_total} %{size_download}" > 0004kv2-ac.B$1.${i}.txt &
done