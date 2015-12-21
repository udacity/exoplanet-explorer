# polymer-cookie
Cookie Web Component for Polymer 1.0

```html
<polymer-cookie
    id="user_cookie"
    name="user_return"
    value=true
    time=14
    format="d">
</polymer-cookie>
```

Note: The `params` attribute must be double quoted JSON.

## Properties
###name###
Type: String
Default value: 'polymer-cookie'

Set the cookie name

###value###
type: String
Default value: ''

The cookie value

###path###
type: String
Default value: '/'

The cookie path

###time###
type: Number
Default value: 1

The expiration time related to the 'format' value.
Set to -1 to never expire the cookie

###format###
type: String
Default value: 'd'

The expiration format time
* 's' : seconds
* 'm' : minutes
* 'h' : hours
* 'd' : days


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## License

[MIT License](https://github.com/andreasonny83/polymer-cookie/blob/master/LICENSE) © Andrea SonnY
