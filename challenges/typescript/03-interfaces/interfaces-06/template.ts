// Challenge: Resource + Deployment interfaces + describeDeployment

export interface Resource {
  // your properties here
}

export interface Deployment extends Resource {
  // your properties here
}

export function describeDeployment(d: Deployment): string {
  // example output: "[abc123] api-server → nginx:latest x 3 replicas"
}
