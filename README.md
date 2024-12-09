# hello!

## running
```
docker compose build
docker compose up
rails db:seed:clear_and_seed
alias test='RAILS_ENV=test bundle exec rspec'
alias serve='export PORT=3002 && rm -f tmp/pids/server.pid && yarn && bundle && ./bin/dev'
```

docker compose run --rm -it -v `pwd`\:/rails -p 3002\:3002 web /bin/bash

hit http://localhost:3002/

## sanity check

Main Functionality:
- [x] Clients that submit and create / edit buildings that they own
- [x] External clients that read all buildings from an API
- [x] clients have custom fields on their buildings
- [x] clients cannot modify custom field configuration

Required database schema objects:
- [x] Clients (name)
- [x] Buildings (Address, State, Zip, *Custom Fields), belong to Client
- [x] Custom Fields configuration (number|freeform|enum), belong to Client
- [x] indexes that make sense for the application

Seeds:
- [x] 5 clients
- [x] small sample of custom fields for each client
- [x] small sample of buildings for each client (with custom fields)

External APIs:
- [x] do NOT Authenticate

client api:
- [x] Create a single Building associated with a client
- [x] error if any Building values were sent that were incorrect
- [?] Return a success message if Building is saved correctly
- [x] Edit Building
- [x] Building index
- [x] basic pagination
- [x] Building Reads have address info, client name, custom fields (even if empty)

{
  "status": "success",
  "buildings": [
    {
      "id": "1",
      "client_name": "rock_walls_only",
      ...

React Frontend
- [x] fetch all building data
- [x] display each building in a card component
- [x] create a new building
- [x] edit an existing building
- [x] add margin and padding for spacing as needed
- [x] use React hooks to manage state


# Perchwell Engineering Take-Home

Welcome to the Perchwell take-home assignment!

# Requirements

Please see the requirements [here](https://github.com/RivingtonHoldings/engineering_take_home/blob/main/REQUIREMENTS.md).

