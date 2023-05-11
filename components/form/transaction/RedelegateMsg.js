import { useEffect, useState } from "react"
import { getDelegations, getValidators, statusList } from "../../../libs/queryClients"
import Input from "../../input/Input"
import { createRedelegateMsg } from "../../../libs/transaction"
import { openNotification } from "../../ulti/Notification"
import ValidatorRow from "../../data_view/ValidatorRow"
import { convertValueFromDenom } from "../../../libs/stringConvert"
import Button from "../../input/Button"
import { InputNumber } from 'antd';

const RedelegateMsg = ({ chain, address, msgs, setMsgs, style }) => {
    const [validators, setValidators] = useState([])
    const [delegations, setdelegations] = useState([])
    const [txBody, setTxBody] = useState({
        validatorSrc: "",
        validatorDest: "",
        amount: 0,
    })
    const [amountError, setAmountError] = useState("")
    const [status, setStatus] = useState(0)
    const [valError, setValError] = useState("")
    const [maxAmount, setMaxAmount] = useState(0)
    const [loading, setLoading] = useState(false)

    const invalidForm = () => {
        for (let key in txBody) {
            if (key === "amount" && txBody[key] === 0) return true
        }
        return false
    }

    const disabled = () => {
        if (invalidForm() || amountError !== "") {
            return true
        }
        return false
    }

    useEffect(() => {
        (async () => {
            try {
                const res = await getDelegations(chain.rpc, address)
                let delegation
                if (res.delegationResponses && res.delegationResponses.length > 0) {
                    delegation = res.delegationResponses[0]
                }
                delegation && setMaxAmount(parseInt(delegation.balance.amount, 10) / 1000000)
                delegation && setTxBody({
                    ...txBody,
                    validatorSrc: delegation.delegation.validatorAddress
                })
                const resVal = await getValidators(chain.rpc)
                resVal.validators && setValidators([...resVal.validators])
                setdelegations([...res.delegationResponses])
            }
            catch (e) {
                openNotification("error", e.message)
            }
        })()
    }, [chain])

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const resVal = await getValidators(chain.rpc, statusList[status])
                resVal.validators && setValidators([...resVal.validators])
                setLoading(false)
            }
            catch (e) {
                openNotification("error", e.message)
                setLoading(false)
            }
        })()
    }, [status])

    const createMsg = async () => {
        try {
            const msg = createRedelegateMsg(
                address,
                txBody.validatorSrc,
                txBody.validatorDest,
                convertValueFromDenom(chain.base_denom, txBody.amount),
                chain.denom
            )
            await setMsgs([...msgs, msg])
            openNotification('success', 'Adding successfully')
        }
        catch (e) {
            openNotification('success', 'Adding unsuccessfully')
        }
    }

    const handleSelect = (e) => {
        setTxBody({
            ...txBody,
            validatorSrc: e.target.value
        })
        if (e.target.value === txBody.validatorDest) setValError("Destination address must be different from the source address")
        else setValError("")
        const filter = delegations.filter(del => del.delegation.validatorAddress === e.target.value)
        const delegation = filter[0]
        setMaxAmount(parseInt(delegation.balance.amount, 10) / 1000000)
    }

    const handleInputNumber = (val) => {
        setTxBody({
            ...txBody,
            amount: parseFloat(val)
        })
    }

    const handleSelectVal = (e) => {
        setTxBody({
            ...txBody,
            validatorDest: e.target.value
        })
        if (e.target.value === txBody.validatorSrc) setValError("Destination address must be different from the source address")
        else setValError("")
    }

    return (
        <div>
            <div
                style={style.input}
            >
                <h4
                    style={{
                        marginBottom: 0
                    }}
                >
                    Delegation
                </h4>
                {
                    delegations.length > 0 ? (
                        <select
                            onChange={handleSelect}
                            style={{
                                width: "100%",
                                padding: "1em",
                                borderRadius: "10px",
                            }}
                        >
                            {
                                delegations.map((delegation, index) => {
                                    return (
                                        <option
                                            value={delegation.delegation.validatorAddress}
                                            key={index}
                                        >
                                            <ValidatorRow
                                                address={delegation.delegation.validatorAddress}
                                                chain={chain}
                                            />
                                        </option>
                                    )
                                })
                            }
                        </select>) : (
                        <div
                            style={{
                                width: "100%",
                                padding: "1em",
                                borderRadius: "10px",
                                backgroundColor: "#808080",
                                color: "white"
                            }}
                        >
                            This address hasn`t delegate to any validators yet!
                        </div>
                    )
                }

            </div>
            <div
                style={style.input}
            >
                <h4
                    style={{
                        marginBottom: 0
                    }}
                >
                    Validator
                </h4>
                <div
                    style={{
                        marginBottom: "10px",
                    }}
                >
                    <div
                        style={{
                            borderRadius: "5px",
                            padding: "2px 5px",
                            backgroundColor: "#ebebeb",
                            width: "15%"
                        }}
                    >
                        <Button
                            text={"Active"}
                            clickFunction={() => {
                                setStatus(0)
                            }}
                            style={{
                                border: 0,
                                borderRadius: "5px",
                                backgroundColor: status === 0 ? "black" : "transparent",
                                color: status === 0 && "white",
                                width: "50%"
                            }}
                        />
                        <Button
                            text={"Inactive"}
                            clickFunction={() => {
                                setStatus(1)
                            }}
                            style={{
                                border: 0,
                                width: "50%",
                                borderRadius: "5px",
                                backgroundColor: status === 1 ? "black" : "transparent",
                                color: status === 1 && "white",
                            }}
                        />
                    </div>
                </div>
                { !loading && <select
                    onChange={handleSelectVal}
                    style={{
                        width: "100%",
                        padding: "1em",
                        borderRadius: "10px",
                    }}
                >
                    {
                        validators.length > 0 && validators.map((validator, index) => {
                            return (
                                <option
                                    value={validator.operatorAddress}
                                    key={index}
                                >
                                    {validator.description.moniker}
                                </option>
                            )
                        })
                    }
                </select>
}

            </div>
            <text
                style={{
                    color: "red",
                    fontSize: ".75rem"
                }}
            >
                {valError}
            </text>
            <h4
                style={{
                    marginBottom: 0
                }}
            >
                {`Delegation amount (${chain.displayDenom.toUpperCase()})`}
            </h4>
            <div
                style={{
                    width: "100%",
                    padding: "1em",
                    borderRadius: "10px",
                    backgroundColor: "#808080",
                    color: "white",
                    marginBottom: "10px"
                }}
            >
                {maxAmount}
            </div>
            <div>
                <h4
                    style={{
                        margin: 0
                    }}
                >
                    {`Amount (${chain.displayDenom.toUpperCase()})`}
                </h4>
                <InputNumber
                    onChange={handleInputNumber}
                    value={txBody.amount}
                    label={`Amount (${chain.displayDenom.toUpperCase()})`}
                    name="amount"
                    placeholder="Amount"
                    style={{
                        ...style.input,
                        width: "100%",
                        borderRadius: "10px",
                        border: "solid 1px black",
                        padding: "10px 0"
                    }}
                />
            </div>
            <Button
                text={"Add Message"}
                style={{
                    backgroundColor: disabled() ? "#808080" : "black",
                    color: "white",
                    padding: "1em",
                    width: "100%",
                    borderRadius: "10px",
                    marginTop: "20px",
                    border: 0
                }}
                clickFunction={async () => await createMsg()}
                disable={disabled()}
            />
        </div>
    )
}

export default RedelegateMsg