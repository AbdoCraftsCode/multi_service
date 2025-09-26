variable "region" {
  type    = string
  default = "eu-west-3"
  description = "The AWS region to deploy to."
}

variable "instance_name" {
  type    = string
  default = "merba3"
  description = "The name of the Lightsail instance."
}

variable "circleci_token" {
  type      = string
  sensitive = true
  description = "The CircleCI API token. Store securely!"
}

variable "circleci_runner_name" {
  type = string
  default = "merba3-runner"
  description = "The name of the CircleCI runner."
}

variable "circleci_runner_group" {
  type = string
  default = "default"
  description = "The CircleCI runner group."
}