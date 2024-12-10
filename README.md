# hello!

## running
spin up the stack
```
docker compose run --rm -it -v `pwd`\:/rails -p 3002\:3002 web /bin/bash
```

set up the env
```
bundle
bundle exec rails db:seed:clear_and_seed
```

run specs (just a few, for faster dev)
```
RAILS_ENV=test bundle exec rspec
```

serve to :3002
```
export PORT=3002 && rm -f tmp/pids/server.pid && yarn && bundle && ./bin/dev
```

using the site:
1. go to http://0.0.0.0:3002
1. "sign in" by selecting a client from top right nav

what to expect
- the layout is a nav up top with content underneath
  - "Home" takes you to the list of buildings
  - "New" takes you to a page to create a new building
  - "Signed in as" dropdown on the right lets you "sign in" as a client
- Home page
  - a list of buildings 
  - limit 2 for paging, just to get a feel for navigating around
  - "Prev Page" and "Next Page" at the top of the list to navigate
  - maps just for fun to fill up the page with color
  - "Open" on a building takes you to the Show/Edit page for that building
- Show/Edit page
  - get here by clicking "Open" from building index
  - automatically redirected here on building create
  - can manually get here through url
  - can be viewed by any client
  - can be deleted/updated by owner client
- New page
  - lets client create a building, including custom attrs


## about

### libraries used

**gem 'json-schema'**

I thought it would be an easy way to validate JSON.  Overall the validation aspect of it works well.  The syntax has a bit of a learning curve.  It's just a method call, so it's pretty flexible.  I wound up just using it to validating the incoming json, but could work nicely in a custom model validator too.  I also wrote a schema for the custom fields.  I didn't wind up using it, but in a real codebase it's a super easy way to prevent employees from generating malformed custom fields, without needing to manage a ton of logic outside of the schema itself.

**gem 'kaminari'**

It's been a while since I used this, so thought it would be a good opportunity to refresh my memory.  It was definitely overkill.  For a smaller personal project, I'd just directly read params and call offset/limit.  For a project with a team that needs a more fully-featured and consistent paging api, it's an ok choice.

**"react-router-dom": "^6.26.2"**

At some point I realized that I wanted pages, and react-router-dom got the job done pretty easily.  Using in a real project, I'd more carefully go through the docs.  There are a couple ways to implement nav using the router (component-based seems to be popular) and while `<Outlet />` is supposed to be an alternative to prop drilling, I'd probably look toward contexts.  Which brings us to ...

**"react-query": "^3.39.3"**

I hadn't used react-query before and this seemed like a good opportunity to try it out.  Overall pretty easy way to do load/mutate data.  For a smaller project, I think react-query would be fine with some abstraction (there's a bit of copy-paste going on here).  It actually doesn't feel all that much different than using contexts, just a bit of extra convenience around not managing providers/reducers.  In the end, I still feel more comfortable copy-pasting my ususal context boilerplate, because once there's a good pattern in a project, manging my own reducers offers a lot of flexibility.  So I'd say for a guaranteed 99% CRUD app, I'd consider react-query, but anything more complex I'd stick with contexts.

**https://matcha.mizu.sh/**

for css i ripped this and then stuck overrides in assets/stylesheets.  That approach has worked really well for me in other projects.  It's simple, but allows for growth into easily managed projects of any scale.

### tradeoffs/discussion

If I had to do it all over again, I would have just grabbed a CRUD react example app off the internet and added custom fields.  Not just because it's easier to copy-paste a solution, but because it would have forced me to think about the problem from a better perspective.  Instead of considering custom fields from the start, it would have been way faster to design a simple CRUD app, establish good patterns, and refactor to allow this extra feature.

Everything is a component, but given that I switched to routing, it might make sense to treat routable components as pages.

This is a low-data, local app, but if it was serving more people, I'd want to look into making react-query work with the router so that there was less reloading.  I might have been a little heavy-handed with useEffect :)

From a readability perspective, it would be nice to abstract some of the crud hooks.

I can get away with sharing the BuildingForm between read/update/create screens for this example app, but this would be unlikely in the real world.  One design drawback is that I'm handling the logic for which buttons to show/hide in the form, which relys on the concrete data from the pages that are using it.  A future dependency inversion refactor could be to extract the button logic and have separate interfaces for the different forms (eg. EditBuildingForm, CreateBuildingForm).

I added an ordered created_at index to buildings because that's a common operation and the requirements said to add indexes.  There are other tricks for paging at scale, like leveraging the id index.  Speaking of which, not sure if I did it here, but on a production app I'd normally bigint anything that seems like it might remotely approach 2 billion records at some point in the next couple decades.

The only requirement I didn't approach literally was the create success message.  I used [docs.perchwell.com](https://docs.perchwell.com/#/reso_getting_started?id=search-by-unique-id) as a guide and the return structure on unique object fetches is a flat result.  It seemed like a possible namespace clash issue, and so I left the "success" field out because I wanted single-object results to have the same structure.  In reality that could be a banned key, easily enforcable with json-schema, or what woudld be even better would be a consistent json structure, like JSON:API.  Which brings us to ...

Serialization.  I went with the most bare-bones rails as_json.  The standard rails serialization library has been under construction since forever and it didn't seem like a good use of my time to dig around for a JSON serialization library that would let me hack around it and not do JSON:API.  For the most part I tried to keep Building concerns in Building and composing concerns in the controller.  It's not terrible, but for a larger project, I'd definitely go for a more standardized way to serialize objects aross models and controllers, whether custom or off-the-shelf.

The big one, custom fields.  There were a few different ways to do this.  Joins.  Denormalized.  Custom table per tenant.  Entity-Attribute-Value.  Originally I was going in the direction of a join table between the custom schema and building, but that seemed like it would introduce a lot of relational complexity.  In a way it would have been nice to have no fields on the building, and have them all be "custom", with some as defaults.  At least that way, all data could be treated the same - and that's what I thought the ask was until I read more carefully and realized that custom fields were, in a sense, virtual.  In the end I went with denormalized, so I'll list the tradeoffs for that:
- the data lives together
- it's clear which data is custom
- more complexity parsing
- more complexity serializing
- front end turned out pretty simple
- ingress/egress have to be robust for custom field changes
- used custom validation
- strong params were a headache, but json-schema ftw

But the issue isn't with relating buildings to fields for a handful of objects.  It's future complexities:
- If we add units for the buildings?  The same pattern could work well.  Rename `custom_fields` -> `custom_building_fields` and mostly copy-pasta.  Wash-rinse-DRY-repeat. 
- If we remove previous custom fields?  The way the metadata currently works, shouldn't be a problem.  Those fields will be ignored on egress and overwritten on ingress.  The only unforseen problem could be that stale buildings would have extra custom fields.  I don't see that being a real issue, but who knows, maybe there's some crazy index and cutting down on vestigial fields would save a few dollars or minutes a year on cloud resources.  In that case, it's only per-client, so pop a task in a worker queue and enjoy the ensuing svelte database.
- If we add more custom fields?  This should already work per the requirements.  If they're not defined, they're null.  The only issue I see is if fields can be marked as required in the future, then it would be a matter of also having a default declared for any required field.
- Search/indexing.  I stored the custom fields as key/value for ease of code writing, but if this was a production app, it might still be a good option, but would warrant deeper consideration.  For example, {"facade":"brick"} would have lower noise for some types of indexing and [{"field-name":"facade","field-value":"brick"}] would have lower (human) complexity for some kinds of queries.  Search/Index simplicity is also an argument for normalization, although that's getting into EAV land, which is traditionally considered complex and difficult to scale, but of course everything has its tradeoffs :)
- If clients want different custom fields per building?  This could be done by having a custom_building_fields table that references buildings.  I don't see anything terrible about instead having a custom schema saved directly to the building.  It would save on requests, lower complexity, and makes sense because it's building-specific data, unlike the exsiting custom field schemas, which express a relationship between clients and buildings.

There wasn't enough time, but I think it's generally a good idea to generate API docs.

Typically I have pretty full test coverage, but in this case I only used specs where I felt it would be a faster development feedback loop than manually checking the browser or using the console.

### personal style/fun

I wanted the react routes to look pretty.  So on the front end, a client can go to /buildings/123 and save a bookmark, and it just works.  But /buildings/123 is overloaded because axios is already using standard rails REST endpoints to fetch JSON data.  It's a quirk of rails' router, but I wound up using a .json file extension on JSON requests so that the router could differentiate between html and json.  There's nothing really wrong with that, but given more time, I'd look into better ways to do this.

Right now, the BuildingList is technically its own page, but I would really like it if there was a clear visual difference between the more public-facing part of the project and the "our stuff" part of the site where clients could CRUD just their own buildings.

I'd like to do some cleanup.  There's a fair amount of state management in the views.  Also I'd like to explore the best practices around caching react-query state between routes.

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
- [ ] Return a success message if Building is saved correctly
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

