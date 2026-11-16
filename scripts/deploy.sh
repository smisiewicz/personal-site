#!/bin/bash


REMOTE_USER="wuovhumy"
REMOTE_HOST="misiewicz.info"
REMOTE_DIR="/home2/wuovhumy/public_html"
LOCAL_DIR="../out"

# SSH into the remote machine and perform the cleanup
echo "Running SSH command to cleanup old files..."
ssh -t "${REMOTE_USER}@${REMOTE_HOST}" "
  # Navigate to the target directory
  cd ${REMOTE_DIR} || exit 1

  # website_eb2e44aa is the document root of smpsychotherapy.com, a separate site that lives inside
  # this folder. It must never be touched by this deploy.

  # Remove files but not in cgi-bin, .well-known or website_eb2e44aa
find . ! -path './cgi-bin*' ! -path './.well-known*' ! -path './website_eb2e44aa*' ! -name '.' ! -name '..' -type f -exec rm -f {} \; 2>/dev/null

# Remove directories but not in cgi-bin, .well-known or website_eb2e44aa
find . ! -path './cgi-bin*' ! -path './.well-known*' ! -path './website_eb2e44aa*' ! -name '.' ! -name '..' -type d -exec rm -rf {} \; 2>/dev/null
"

# Check if SSH command was successful
if [ $? -ne 0 ]; then
  echo "SSH connection failed or cleanup command failed."
else
  echo "SSH cleanup successful."
fi

# Copy the local directory to the remote server, preserving directory structure
echo "Running SCP command to deploy new files..."
scp -r "${LOCAL_DIR}/." "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"


# Check if SCP command was successful
if [ $? -ne 0 ]; then
  echo "SCP transfer failed."
  exit 1
fi

echo "Process completed successfully."
