package environment

type EnvironmentType string

const (
	Development EnvironmentType = "development"
	Production  EnvironmentType = "production"
	QA          EnvironmentType = "qa"
)
