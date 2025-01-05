#!/bin/bash


REMOTE_USER="wuovhumy"
REMOTE_HOST="misiewicz.info"
REMOTE_DIR="/home2/wuovhumy/public_html"
LOCAL_DIR="../dist"

# SSH into the remote machine and perform the cleanup
ssh "${REMOTE_USER}@${REMOTE_HOST}" <<EOF
  # Navigate to the target directory
  cd ${REMOTE_DIR} || exit 1

  # Remove files but not in cgi-bin and .well-known
  find . ! -path './cgi-bin*' ! -path './.well-known*' -type f -exec rm -f {} \;

  # Remove directories but not cgi-bin and .well-known
  find . ! -path './cgi-bin*' ! -path './.well-known*' -type d -exec rm -rf {} \;
EOF

# Check if SSH command was successful
if [ $? -ne 0 ]; then
  echo "SSH connection failed or cleanup command failed."
  exit 1
fi

# Copy the local directory to the remote server, preserving directory structure
echo "ABOUT TO RUN: ${LOCAL_DIR} ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"
scp -r "${LOCAL_DIR}/." "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"


# Check if SCP command was successful
if [ $? -ne 0 ]; then
  echo "SCP transfer failed."
  exit 1
fi

echo "Process completed successfully."
