terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_lightsail_key_pair" "merba3_lightsail_key" {
  name       = "merba3-key"
}

resource "local_file" "lightsail_private_key_file" {
  filename      = "${path.module}/keys/merba3-key.pem"
  content       = aws_lightsail_key_pair.merba3_lightsail_key.private_key
  file_permission = "0600"
}

resource "aws_lightsail_instance" "merba3_lightsail_instance" {
  name              = var.instance_name
  availability_zone = "${var.region}a"
  blueprint_id      = "ubuntu_24_04"
  bundle_id         = "small_3_0"
  key_pair_name     = aws_lightsail_key_pair.merba3_lightsail_key.name

  provisioner "remote-exec" {
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = aws_lightsail_key_pair.merba3_lightsail_key.private_key
      host        = self.public_ip_address
      timeout = "15m"
    }
    inline = [
      "sudo apt update",
      "sudo apt upgrade -y",

      # Install Docker
      "sudo apt install apt-transport-https ca-certificates curl software-properties-common -y",
      "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
      "sudo add-apt-repository 'deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable' -y",
      "sudo apt update",
      "sudo apt install docker-ce -y",

      # Make docker run without sudo
      "sudo usermod -aG docker $USER",
      "newgrp docker",

      # Install CircleCI Agent
      "curl -s https://packagecloud.io/install/repositories/circleci/runner/script.deb.sh?any=true | sudo bash",
      "sudo apt-get install -y circleci-runner",
      "export RUNNER_AUTH_TOKEN=${var.circleci_token}",
      "sudo sed -i 's/<< AUTH_TOKEN >>/$RUNNER_AUTH_TOKEN/g' /etc/circleci-runner/circleci-runner-config.yaml",
      "sudo systemctl enable circleci-runner",
      "sudo systemctl start circleci-runner",

      # # Generate dhparam 2048 bits
      # "sudo mkdir -p ~/dhparam",
      # "sudo openssl dhparam -out ~/dhparam/dhparam-2048.pem 2048",
    ]
  }
}

resource "aws_lightsail_instance_public_ports" "merba3_lightsail_ports" {
  instance_name = aws_lightsail_instance.merba3_lightsail_instance.name

  port_info {
    protocol = "tcp"
    from_port = 443
    to_port   = 443
  }
  port_info {
    protocol = "tcp"
    from_port = 80
    to_port   = 80
  }
  port_info {
    protocol = "tcp"
    from_port = 22
    to_port   = 22
  }
}

resource "aws_lightsail_static_ip" "merba3_static_ip" {
  name = "${var.instance_name}-static-ip"
}

resource "aws_lightsail_static_ip_attachment" "merba3_static_ip_attachment" {
  static_ip_name = aws_lightsail_static_ip.merba3_static_ip.name
  instance_name  = aws_lightsail_instance.merba3_lightsail_instance.name
}

output "lightsail_static_ip" {
  value = aws_lightsail_static_ip.merba3_static_ip.ip_address
}