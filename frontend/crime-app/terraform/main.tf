resource "aws_amplify_app" "frontend" {
  name       = var.app_name
  repository = var.repository
  oauth_token = var.github_token

  # Build settings for React
  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - npm install
        build:
          commands:
            - npm start
      artifacts:
        baseDirectory: build
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
  EOT

  # Auto-build on code push
  enable_branch_auto_build = true
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = var.branch
}

output "amplify_url" {
  value = "https://${aws_amplify_branch.main.branch_name}.${aws_amplify_app.frontend.default_domain}"
}