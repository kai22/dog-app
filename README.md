
# Write a react app (create-react-app is fine as a scaffold, or whatever generator you want), that meets the following criteria:

Functionality - Dog Poster Generator:
** Be able to specify 1-N breed/sub-breed combinations, and a count for each combo, then click a 'generate' button to display a modal containing the requested images tiled in a grid, randomly sorted.

### | v Breed Dropdown v | v Sub-breed Dropdown v |  # of images | 
### | v Breed Dropdown v | v Sub-breed Dropdown v |  # of images | + <-- click plus to add a row

# Technical requirements:

** Use https://material-ui.com/ for the UI components
** Use the sanford dog api for data, INCLUDING dropdown population https://dog.ceo/dog-api/documentation/
** Use a least one HOC
Jest specs for at least one component in the appProps

For bonus points:
use Typescript
use Suspense
use a custom theme
80% test coverage
Use global state via redux - data down, events up (Required if applying for senior-level position)