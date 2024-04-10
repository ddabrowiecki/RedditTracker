#!/bin/sh

# Decrypt the file
mkdir $HOME/secrets
# --batch to prevent interactive command
# --yes to assume "yes" for questions
gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_GOOGLE_PASSPHRASE" \
--output $HOME/secrets/GoogleCreds.json GoogleCreds.json.gpg
