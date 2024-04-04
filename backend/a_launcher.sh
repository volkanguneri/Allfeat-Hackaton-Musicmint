#!/bin/bash

while true
do
    echo "Welcome to the deployment menu"
    echo "Please select an option:"

    PS3='Choose a deployment option: '
    options=("Tests" "Deploy Local" "Deploy Harmonie Testnet" "Quit")
    select opt in "${options[@]}"
    do
        case $opt in
            "Tests")
                echo "Testing the contracts on localhost network"
                REPORT_GAS=true npx hardhat coverage
                break
                ;;
            "Deploy Local")
                echo "Deploying contracts on localhost network"
                npx hardhat run scripts/deploy.js --network localhost
                break
                ;;
            "Deploy Harmonie Testnet")
                echo "Deploying factory on localhost network"
                npx hardhat run scripts/deploy.js --network localhost
                break
                ;;
            "Quit")
                echo "Exiting..."
                exit 0
                ;;
            *) echo "Invalid option $REPLY";;
        esac
    done
done
