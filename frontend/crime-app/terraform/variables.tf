variable "app_name" {
  description = "Name of the Amplify app"
  default     = "crime-app"
}

variable "github_token" {
  description = "GitHub personal access token"
  sensitive   = true
}

variable "repository" {
  description = "GitHub repository URL"
  default     = "https://github.com/as8675/crime-atlas"
}

variable "branch" {
  description = "Branch to deploy"
  default     = "master"
}