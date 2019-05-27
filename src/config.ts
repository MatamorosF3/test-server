interface ProjectConfig {
    PORT: string
}

export const config: ProjectConfig = {
    PORT: process.env.PORT || '3000'
} 