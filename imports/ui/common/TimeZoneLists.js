/* eslint-disable no-use-before-define */
import React from 'react'
import { PureComponent } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import * as moment from 'moment-timezone'

class TimeZoneLists extends PureComponent {
    state = { timezones: [], defaultTimeZone: '' }
    async componentDidMount() {
        const result = await this.getTimeZoneOptions()
        await this.setState({ timezones: result })
    }

    getTimeZoneOptions = async () => {
        const timeZones = moment.tz.names()
        const offsetTmz = []
        for (const i in timeZones) {
            const tz = timeZones[i]
            const value = moment.tz(tz).format('Z')
            const timeZoneOption = {
                label: `${tz} (GMT${value})`,
                value
            }
            offsetTmz.push(timeZoneOption)
        }
        return offsetTmz
    }
    handleTimeZoneChange = async (event, timezone) => {
        this.props.onTimeZoneValue(timezone.value)
    }
    render() {
        return (
            < div >
                <Autocomplete
                    options={this.state.timezones}
                    value={this.props.value}
                    getOptionLabel={(option) => option.label}
                    onChange={this.handleTimeZoneChange}
                    renderInput={(params) => <TextField {...params} placeholder="TimeZone" />}
                />
            </div >
        )
    }
}
export default (TimeZoneLists)