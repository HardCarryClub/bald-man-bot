#!/bin/bash

# Written with Gemini because I'm lazy and don't want to write it myself.

check_env() {
  local env_file=".env"
  
  local keys=(
    "DISCORD_TOKEN"
    "DISCORD_APP_ID"
    "DISCORD_PUBLIC_KEY"
  )

  local keys_added=()

  if ([ ! -f "$env_file" ] || [ ! -s "$env_file" ]); then
    echo "⚠️ $env_file not found. Creating it..."
    touch "$env_file"
  fi

  for key in "${keys[@]}"; do
    if ! grep -q "^$key=" "$env_file"; then
      echo "Adding $key to $env_file"
      echo "$key=" >> "$env_file"
      keys_added+=("$key")
    else
      echo "$key already exists in $env_file"
    fi
  done

  if [ ${#keys_added[@]} -eq 0 ]; then
    echo "✅ All required keys are already present in $ENV_FILE."
  else
    echo "➕ Added missing keys to $ENV_FILE:"
    for key in "${keys_added[@]}"; do
      echo "  - $key"
    done
  fi
}

check_data_dir() {
  local data_dir="${1:-data}"  # Default to 'data' if no argument passed

  if [ -d "$data_dir" ]; then
    echo "✅ Data directory '$data_dir' already exists."
  else
    echo "📁 Data directory '$data_dir' not found. Creating it..."
    mkdir -p "$data_dir"

    if [ $? -eq 0 ]; then
      echo "✅ Created '$data_dir' successfully."
    else
      echo "❌ Failed to create '$data_dir'. Check permissions."
      return 1
    fi
  fi
}

check_env
check_data_dir

echo "Installing dependencies..."
bun install

echo "Installing Lefthook..."
bun run lefthook install