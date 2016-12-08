var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var ButtonsInstance = ReactBootstrap.ButtonsInstance;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var ButtonInput = ReactBootstrap.ButtonInput;
var Button = ReactBootstrap.Button;

var Table = ReactBootstrap.Table;
var Dropdown = ReactBootstrap.Dropdown;
var MenuItem = ReactBootstrap.MenuItem;
var Glyphicon = ReactBootstrap.Glyphicon;
var Jumbotron = ReactBootstrap.Jumbotron;
var Pager = ReactBootstrap.Pager;
var Panel = ReactBootstrap.Panel;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;
var panel = ReactBootstrap.panel;

var dropdown1Val = "全專輯";
var dropdown2Val = "全成員";
var dropdown3Val = "換出卡片";
var dropdown4Val = "換入卡片";

var dropdown1Menu = [];
var dropdown2Menu = [];
var dropdown3Menu = [];
var dropdown4Menu = [];

var Release_List = [];
var Wish_List = [];

var Release_List_Table = [];
var Wish_List_Table = [];

var CardData_json = {};

var AlbumData_json_url = "https://spreadsheets.google.com/feeds/list/1N-3BVlH3kYPkZ_gWyaInaBa1y4OQJ59PRHs0N0w51Dk/5/public/values?alt=json";
var MemberData_json_url = "https://spreadsheets.google.com/feeds/list/1N-3BVlH3kYPkZ_gWyaInaBa1y4OQJ59PRHs0N0w51Dk/4/public/values?alt=json";
var CardData_json_url = "https://spreadsheets.google.com/feeds/list/1N-3BVlH3kYPkZ_gWyaInaBa1y4OQJ59PRHs0N0w51Dk/1/public/values?alt=json";

var send_url = "https://script.google.com/macros/s/AKfycbzj7N0OxrrrbKeOW2TFfrDQtwkguqKGHe1hvauO2O9Wx1yec2hN/exec?";

var SetIntervalMixin = {
    componentWillMount() {
        this.intervals = [];
    },
    setInterval() {
        this.intervals.push(setInterval.apply(null, arguments));
    },
    componentWillUnmount() {
        this.intervals.forEach(clearInterval);
    }
};


var Main = React.createClass({
    mixins: [SetIntervalMixin],
    getInitialState() {
        return { seconds: 0, id: '', pw: '', gas: '' };
    },

    componentDidMount() {
        this.getDBjson();
    },

    getDBjson() {
        var this1 = this;
        $.ajax({
            url: AlbumData_json_url,
            global: false,
            type: 'GET',
            dataType: 'json',
            async: true,
            success: function (json) {

                dropdown1Menu.push(<MenuItem eventKey="全專輯" onSelect={this1.handleChange1}>全專輯</MenuItem>);
                for (var i = 0; i < json.feed.entry.length; i++) {
                    dropdown1Menu.push(<MenuItem eventKey={json.feed.entry[i].gsx$name.$t} onSelect={this1.handleChange1}>{json.feed.entry[i].gsx$no.$t}.{json.feed.entry[i].gsx$name.$t}({json.feed.entry[i].gsx$text.$t})</MenuItem>);
                }
            }
        });

        $.ajax({
            url: MemberData_json_url,
            global: false,
            type: 'GET',
            dataType: 'json',
            async: true,
            success: function (json) {
                dropdown2Menu.push(<MenuItem eventKey="全成員" onSelect={this1.handleChange2}>全成員</MenuItem>);
                for (var i = 0; i < json.feed.entry.length; i++) {
                    dropdown2Menu.push(<MenuItem eventKey={json.feed.entry[i].gsx$name.$t} onSelect={this1.handleChange2}>{json.feed.entry[i].gsx$no.$t}.{json.feed.entry[i].gsx$name.$t}({json.feed.entry[i].gsx$text.$t})</MenuItem>);
                }
            }
        });

        $.ajax({
            url: CardData_json_url,
            global: false,
            type: 'GET',
            dataType: 'json',
            async: true,
            success: function (json) {
                CardData_json = json;
                for (var i = 0; i < CardData_json.feed.entry.length; i++) {
                    dropdown3Menu.push(<MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this1.handleChange3}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                    dropdown4Menu.push(<MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this1.handleChange4}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                }
            }
        });
    },

    handleChange1(e) {
        console.log(e);
        dropdown1Val = e;
        $(ReactDOM.findDOMNode(this.refs.dropdown1Val)).html(dropdown1Val);

        dropdown3Menu.splice(0, dropdown3Menu.length);
        dropdown4Menu.splice(0, dropdown4Menu.length);

        if (dropdown1Val == "全專輯" && dropdown2Val == "全成員") {
            for (var i = 0; i < CardData_json.feed.entry.length; i++) {
                dropdown3Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange3}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                dropdown4Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange4}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
            }
        } else if (dropdown1Val == "全專輯" && dropdown2Val != "全成員") {
            for (var i = 0; i < CardData_json.feed.entry.length; i++) {
                if (CardData_json.feed.entry[i].gsx$membername.$t == dropdown2Val) {
                    dropdown3Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange3}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                    dropdown4Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange4}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                }
            }
        } else if (dropdown1Val != "全專輯" && dropdown2Val == "全成員") {
            for (var i = 0; i < CardData_json.feed.entry.length; i++) {
                if (CardData_json.feed.entry[i].gsx$albumname.$t == dropdown1Val) {
                    dropdown3Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange3}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                    dropdown4Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange4}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                }
            }
        } else if (dropdown1Val != "全專輯" && dropdown2Val != "全成員") {
            for (var i = 0; i < CardData_json.feed.entry.length; i++) {
                if (CardData_json.feed.entry[i].gsx$albumname.$t == dropdown1Val & CardData_json.feed.entry[i].gsx$membername.$t == dropdown2Val) {
                    dropdown3Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange3}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                    dropdown4Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange4}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                }
            }
        }
    },

    handleChange2(e) {
        console.log(e);
        dropdown2Val = e;
        $(ReactDOM.findDOMNode(this.refs.dropdown2Val)).html(dropdown2Val);
        dropdown3Menu.splice(0, dropdown3Menu.length);
        dropdown4Menu.splice(0, dropdown4Menu.length);

        if (dropdown1Val == "全專輯" && dropdown2Val == "全成員") {
            for (var i = 0; i < CardData_json.feed.entry.length; i++) {
                dropdown3Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange3}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                dropdown4Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange4}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
            }
        } else if (dropdown1Val == "全專輯" && dropdown2Val != "全成員") {
            for (var i = 0; i < CardData_json.feed.entry.length; i++) {
                if (CardData_json.feed.entry[i].gsx$membername.$t == dropdown2Val) {
                    dropdown3Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange3}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                    dropdown4Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange4}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                }
            }
        } else if (dropdown1Val != "全專輯" && dropdown2Val == "全成員") {
            for (var i = 0; i < CardData_json.feed.entry.length; i++) {
                if (CardData_json.feed.entry[i].gsx$albumname.$t == dropdown1Val) {
                    dropdown3Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange3}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                    dropdown4Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange4}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                }
            }
        } else if (dropdown1Val != "全專輯" && dropdown2Val != "全成員") {
            for (var i = 0; i < CardData_json.feed.entry.length; i++) {
                if (CardData_json.feed.entry[i].gsx$albumname.$t == dropdown1Val & CardData_json.feed.entry[i].gsx$membername.$t == dropdown2Val) {
                    dropdown3Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange3}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                    dropdown4Menu.splice(dropdown3Menu.length, 0, <MenuItem eventKey={CardData_json.feed.entry[i].gsx$id.$t} onSelect={this.handleChange4}>{CardData_json.feed.entry[i].gsx$id.$t}.{CardData_json.feed.entry[i].gsx$cardname.$t}</MenuItem>);
                }
            }
        }
    },

    handleChange3(e) {
        console.log(e);
        dropdown3Val = e;
        $(ReactDOM.findDOMNode(this.refs.dropdown3Val)).html(dropdown3Val);
        Release_List.splice(Release_List.length, 0, dropdown3Val);

        var n = [];
        for (var i = 0; i < Release_List.length; i++) {
            if (n.indexOf(Release_List[i]) == -1) n.push(Release_List[i]);
        }
        Release_List = n;
        console.log(Release_List);
        Release_List_Table.splice(0, Release_List_Table.length);

        for (var i = 0; i < Release_List.length; i++) {
            Release_List_Table.splice(Release_List_Table.length, 0, <tr><td id={Release_List[i]} onClick={() => this.tdonclick1(event.target.id)}>{Release_List[i]}</td></tr>);
        }

        console.log(Release_List_Table);
        this.forceUpdate();
    },

    handleChange4(e) {
        console.log(e);
        dropdown4Val = e;
        $(ReactDOM.findDOMNode(this.refs.dropdown4Val)).html(dropdown4Val);
        Wish_List.splice(Wish_List.length, 0, dropdown4Val);

        var n = [];
        for (var i = 0; i < Wish_List.length; i++) {
            if (n.indexOf(Wish_List[i]) == -1) n.push(Wish_List[i]);
        }
        Wish_List = n;
        console.log(Wish_List);

        Wish_List_Table.splice(0, Wish_List_Table.length);

        for (var i = 0; i < Wish_List.length; i++) {
            Wish_List_Table.splice(Wish_List_Table.length, 0, <tr><td id={Wish_List[i]} onClick={() => this.tdonclick2(event.target.id)}>{Wish_List[i]}</td></tr>);
        }

        console.log(Wish_List_Table);
        this.forceUpdate();
    },



    tdonclick1(e) {
        console.log(e);

        var index = Release_List.indexOf(e);
        Release_List.splice(index, 1);

        Release_List_Table.splice(0, Release_List_Table.length);
        for (var i = 0; i < Release_List.length; i++) {
            Release_List_Table.splice(Release_List_Table.length, 0, <tr><td id={Release_List[i]} onClick={() => this.tdonclick1(event.target.id)}>{Release_List[i]}</td></tr>);
        }
        this.forceUpdate();
    },

    tdonclick2(e) {
        console.log(e);

        var index = Wish_List.indexOf(e);
        Wish_List.splice(index, 1);

        Wish_List_Table.splice(0, Wish_List_Table.length);
        for (var i = 0; i < Wish_List.length; i++) {
            Wish_List_Table.splice(Wish_List_Table.length, 0, <tr><td id={Wish_List[i]} onClick={() => this.tdonclick2(event.target.id)}>{Wish_List[i]}</td></tr>);
        }
        this.forceUpdate();
    },

    send() {
        console.log("send");

        console.log(this.state.id);
        console.log(this.state.pw);

        console.log(Release_List.toString());
        console.log(Wish_List.toString());
        var this1 = this;

        $.ajax({
            url: send_url + "User_ID=" + this.state.id + "&User_PW=" + this.state.pw + "&Release_List=" + Release_List.toString() + "&Wish_List=" + Wish_List.toString(),
            global: false,
            type: 'GET',
            dataType: 'text',
            async: true,
            success: function (text) {
                console.log(text);
                this1.setState({ gas: text });

            }
        });
        this.clear();
    },

    clear() {
        this.setState({ id: '' });
        this.setState({ pw: '' });
    },

    inputhandleChange1(e) {
        this.setState({ id: e.target.value });
    },

    inputhandleChange2(e) {
        this.setState({ pw: e.target.value });
    },


    render() {
        return (
            <Grid>
                <Row className="well">
                    <Pager>
                        <Panel header=<h0>新增換卡資訊</h0> bsStyle="info">
                            <FormGroup controlId="formHorizontalEmail">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Email
                </Col>
                                <Col sm={10}>
                                    <FormControl value={this.state.id} onChange={this.inputhandleChange1} type="email" placeholder="Email" />
                                </Col>
                            </FormGroup>

                            <FormGroup controlId="formHorizontalPassword">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Password
                </Col>
                                <Col sm={10}>
                                    <FormControl value={this.state.pw} onChange={this.inputhandleChange2} type="password" placeholder="Password" />
                                </Col>
                            </FormGroup>

                            <Grid>
                                <Row className="show-grid">
                                    <Col componentClass={ControlLabel} sm={6} md={6}>
                                        <ButtonToolbar >
                                            <Dropdown id="dropdown-custom-1">
                                                <Dropdown.Toggle>
                                                    <Glyphicon />
                                                    <h ref="dropdown1Val">{dropdown1Val}</h>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu ref="dropdown1Menu">
                                                    {dropdown1Menu}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </ButtonToolbar>
                                    </Col>

                                    <Col componentClass={ControlLabel} sm={6} md={6}>
                                        <ButtonToolbar >
                                            <Dropdown id="dropdown-custom-2">
                                                <Dropdown.Toggle>
                                                    <Glyphicon />
                                                    <h ref="dropdown2Val">{dropdown2Val}</h>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu ref="dropdown2Menu">
                                                    {dropdown2Menu}
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </ButtonToolbar>
                                    </Col>
                                </Row>


                                <Row className="show-grid">
                                    <Col componentClass={ControlLabel} sm={6} md={6}>
                                        <ButtonToolbar >
                                            <Dropdown id="dropdown-custom-3">
                                                <Dropdown.Toggle>
                                                    <Glyphicon />
                                                    <h ref="dropdown3Val">{dropdown3Val}</h>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu ref="dropdown3Menu">{dropdown3Menu}</Dropdown.Menu>
                                            </Dropdown>
                                        </ButtonToolbar>
                                    </Col>

                                    <Col componentClass={ControlLabel} sm={6} md={6}>
                                        <ButtonToolbar >
                                            <Dropdown id="dropdown-custom-4">
                                                <Dropdown.Toggle>
                                                    <Glyphicon />
                                                    <h ref="dropdown4Val">{dropdown4Val}</h>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu ref="dropdown4Menu">{dropdown4Menu}</Dropdown.Menu>
                                            </Dropdown>
                                        </ButtonToolbar>
                                    </Col>
                                </Row>
                            </Grid>

                            <Row className="show-grid">
                                <Col sm={6} md={6}>
                                    <Table striped bordered condensed hover>
                                        <thead>
                                            <tr>
                                                <th>換出卡片ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>{Release_List_Table}</tbody>
                                    </Table>
                                </Col>


                                <Col sm={6} md={6}>
                                    <Table striped bordered condensed hover>
                                        <thead>
                                            <tr>
                                                <th>換入卡片ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>{Wish_List_Table}</tbody>
                                    </Table>
                                </Col>
                            </Row>

                            <Row className="show-grid">
                                <FormGroup>
                                    <Col sm={12}>
                                        <Button bsStyle="primary" bsSize="large" onClick={this.send} block>送出</Button>
                                        <FormControl value={this.state.gas} type="text" />
                                    </Col>
                                </FormGroup>
                            </Row>
                        </Panel>

                        <Panel header=<h0>查詢卡片</h0> bsStyle="info">
                        </Panel>

                        <Panel header=<h0>刪除換卡資訊</h0> bsStyle="info">
                        </Panel>
                    </Pager>
                </Row>
            </Grid>
        );
    }
});
ReactDOM.render(<Main />, main);