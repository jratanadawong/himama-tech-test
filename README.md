# README

1. `bundle install`
2. `yarn install`
3. `foreman start`

## Approach
I went with a top-down approach, imaganing what the end user would interface with, and mocked it up in pencil. This helped me define the important data that the user would need. From here, I started architecting the backend, which is more involved than it needed to be.

I've set up Rails on the backend to serve up an API to a Vue frontend, using foreman for development to get them up and running. The Vue app and the rails app live on the same port, and I used route namespacing to funnel all the API calls through `/api/v1/...`, and forwarded the rest to a Vue router that manages all the views.

An early problem I encountered with Rails put me down the path of creating full users, as Rails magic started asking that I provide authoriziation simply by naming a model `User`, so I ended up creating a full registration and authentication solution. Because I'm only using Rails to serve up the API, it's using JWT to authenticate user requests. The registration/login endpoints aren't protected, for obvious reasons, but everything else is.

I'm using Vuex to manage state on the frontend, which manages unsaved timesheet entries and user data, including the auth token. This means that you don't have to provide any user information through transactions with the backend, as the auth token points to the current user.

## Schema
Initially I wanted to go with:
__User__
has_one :timesheet
has_many entries, through: :timesheet

__Timesheet__
belongs_to :user
has_many :entries

__Entry__
belongs_to :timesheet
belongs_to :user

but I decided that the join table doesn't really serve a purpose, and it increased the number of requests necessary to populate the dashboard view. In the end, I dropped the `Timesheet` model for a direct `User has_many :entries`  relationship to uncomplicate the process.

## Improvements
If I had more time I'd probably not use Rails, as it proved a barrier through it's implicit data structures, and how it performs at scale. I'd also move towards GraphQL and re-add the `Timesheet` model, as GraphQL would bring the number of requests down, but also provide the structure that made me want to add `Timesheet` in the first place. 

Those are bigger changes though, but if I had a day to work on it I'd probably just get it put on a website, and get the data moving again.

Another list of quick wins would be:

- Validations: time, time selector(cannot clock out before your clock in time), email, password, etc. There's limited ones in place, but a full validation suite would be better.
- Responsiveness: I designed it with mobile in mind, but it won't scale terribly well beyond a certain point. I had intentions of doing more mobile designs if I had time, but it's non-existent now.
- Delete: The ability to delete entries. It's on the list as a requirement, but it's a very challenging thing to add if you want to create an audit log. You'd have to soft delete entries, and the data structure on that becomes far more complicated than the scope of the app suggests.
- Password salting: oops. It's just sending a raw password now. It was more about proof of concept, but I just didn't prioritize it.

## Challenges
I faced a few challenges making this. For the sake of learning:

1. __Scale.__ The app is much bigger than probably intended from the outline. The challenge stemmed from a few different places, but ultimately falls to how ambitious I was in what I thought would be reasonable, and how I interpreted the task to be larger in scope than it absolutely needed to be. I treated it as an MVP instead of a demonstration of concept.

2. __Rails datatyping.__ One of the best things about Rails is also what it makes it challenging. It's very opinionated about a number of things, but doesn't explicitly state those things, so you have to work with a lot of assumed knowledge. The big datatype problems I encountered were with ActiveRecord not throwing errors when date formating didn't match it's expectations, which doesn't work well with how I structured the date/time selectors. I've ripped out a lot of time picking tools for a simple input, but it's very weak.

3. __Prototyping.__ I started by hard-coding the entirety of the app, which means the flow of the app makes sense, but fell apart when exposed to the data that wasn't formatted/as malleable as expected. What I should've done was get all aspects of the API up and running instead of swapping back and forth until they met in the middle. Often that works depending on the size of your team and the proximity of your deadline, but working alone with a tight deadline doesn't help.