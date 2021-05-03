// ReactJS components
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// MaterialUI components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

// Local ReactJS components
import Typography from '../components/landingpage/modules/components/Typography';
import AppFooter from '../components/landingpage/modules/views/AppFooter';
import AppAppBar from '../components/landingpage/modules/views/AppAppBar';
import withRoot from '../components/landingpage/modules/withRoot';

// Plotly
import Plot from 'react-plotly.js';

const styles = (theme) => ({
    root: {
        display: 'flex',
        overflow: 'hidden',
        marginBottom: theme.spacing(2),
    },
    container: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    paper: {
        backgroundColor: '#fbf3fb',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(0, 5),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    title: {
        marginBottom: theme.spacing(4),
    },
    button: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(2),
        minWidth: 200,
    },
});


function VerifyPriceScreenDemo(props) {
    // material-ui styles
    const { classes } = props;

    // Get url parameters
    let { storeId, productId } = useParams();

    // hook states
    const [productName, setProductName] = useState("");
    const [storeName, setStoreName] = useState("");
    const [currentPrice, setCurrentPrice] = useState(null);
    const [oldPrice, setOldPrice] = useState(null);
    const [currency, setCurrency] = useState("");
    const [priceDifference, setPriceDifference] = useState(null);
    const [showPrices, setShowPrices] = useState(false);
    const [priceDates, setPriceDates] = useState(false);
    const [priceAmounts, setPriceAmounts] = useState(false);


    useEffect(() => {
        setProductName("Mastering Ethereum book");
        setStoreName("Online book seller");
        setCurrentPrice(39);
        setOldPrice(49);
        setCurrency("EUR");
        if (currentPrice != null && oldPrice != null) {
            setPriceDifference((100 * (oldPrice - currentPrice) / oldPrice).toFixed(2));
        }
    }, [currentPrice, oldPrice]);

    function seePriceHistory() {
        setShowPrices(!showPrices);
        setPriceDates(['2020-10-04 22:23:00', '2020-11-04 22:23:00', '2020-12-04 22:23:00']);
        setPriceAmounts([69, 49, 39]);
    }

    // calculating relative price change
    let pnlInfo = "/";
    if (priceDifference > 0) {
        pnlInfo = (<span style={{ color: 'red', fontWeight: 'bold' }}>
            {Math.abs(priceDifference)}%
            <TrendingDownIcon fontSize="medium" />
        </span>);
    }
    else if (priceDifference < 0) {
        pnlInfo = (<span style={{ color: 'green', fontWeight: 'bold' }}>
            {Math.abs(priceDifference)}%
            <TrendingUpIcon fontSize="medium" />
        </span>);
    }

    return (
        <React.Fragment>
            <AppAppBar />
            <section className={classes.root}>
                <Container className={classes.container}>
                    <Typography variant="h3" gutterBottom marked="center" align="center">
                        <span style={{ fontWeight: "lighter", fontFamily: "monospace" }}>Verify the price</span>
                    </Typography>
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={2}></Grid>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} className={classes.paper}>
                                <div className={classes.item}>
                                    <Typography variant="h5" align="center">
                                        {productName}
                                    </Typography>
                                    <Typography variant="subtitle1" align="center">
                                        Store: {storeName}
                                    </Typography>
                                </div>
                                <Divider variant="middle" />
                                <div className={classes.item}>
                                    <Typography variant="h6" align="center">
                                        Current price: {currentPrice} {currency}
                                    </Typography>
                                    <Typography variant="subtitle1" align="center">
                                        (Old price: {oldPrice} {currency})
                                        </Typography>
                                    <Typography variant="h6" align="center">
                                        Price change:&nbsp;
                                        {pnlInfo}
                                    </Typography>
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        size="large"
                                        className={classes.button}
                                        component="a"
                                        onClick={seePriceHistory}
                                    >
                                        See price history
                                    </Button>
                                </div>
                                <div className={classes.item}>
                                    {showPrices &&
                                        <div>
                                            <Typography variant="h5" align="center">
                                                Historical price changes
                                            </Typography>
                                            <Divider variant="middle" />
                                            <div className={classes.item}>
                                                <Paper elevation={1}>
                                                    <Plot
                                                        data={[
                                                            {
                                                                x: priceDates,
                                                                y: priceAmounts,
                                                                type: 'scatter',
                                                                fill: 'tozeroy',
                                                                mode: 'lines+markers',
                                                                marker: { color: 'pink' },
                                                            },
                                                        ]}
                                                        layout={{ width: 520, height: 340, title: 'Price changes over time' }}
                                                    />
                                                </Paper>
                                            </div>
                                        </div>}
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={2}></Grid>
                    </Grid>
                </Container>
            </section>
            <AppFooter />
        </React.Fragment>
    );
}


export default withRoot(withStyles(styles)(VerifyPriceScreenDemo));