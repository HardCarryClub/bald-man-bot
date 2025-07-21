FROM oven/bun:debian

# Config Bun
ENV PATH="~/.bun/bin:${PATH}"
RUN ln -s /usr/local/bin/bun /usr/local/bin/node

# Update packages
# RUN if [ "debian" == "alpine" ] ; then apk update ; else apt-get update ; fi

# Install Git
# RUN if [ "debian" == "alpine" ] ; then apk add git ; else apt-get install -y git ; fi

# Install dependencies for cloudflared
RUN apt-get update && apt-get install -y \
  curl \
  gnupg \
  ca-certificates \
  lsb-release

# Add Cloudflare's GPG key and APT repo for Bookworm
RUN curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | gpg --dearmor -o /usr/share/keyrings/cloudflare-archive-keyring.gpg && \
  echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared bookworm main' | tee /etc/apt/sources.list.d/cloudflared.list

# Install cloudflared
RUN apt-get update && apt-get install -y cloudflared

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*