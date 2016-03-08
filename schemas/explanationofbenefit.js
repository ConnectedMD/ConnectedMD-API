// Copyright (c) 2011+, HL7, Inc & The MITRE Corporation
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without modification, 
// are permitted provided that the following conditions are met:
// 
//     * Redistributions of source code must retain the above copyright notice, this 
//       list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright notice, 
//       this list of conditions and the following disclaimer in the documentation 
//       and/or other materials provided with the distribution.
//     * Neither the name of HL7 nor the names of its contributors may be used to 
//       endorse or promote products derived from this software without specific 
//       prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
// ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
// IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
// NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR 
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
// POSSIBILITY OF SUCH DAMAGE.

var mongoose = require('mongoose');

var ExplanationOfBenefitSchema = new mongoose.Schema({
    identifier: [{
        use: String,
        label: String,
        system: String,
        value: String
    }],
    claim: {
    },
    claimResponse: {
    },
    ruleset: {
        system: String,
        code: String,
        display: String
    },
    originalRuleset: {
        system: String,
        code: String,
        display: String
    },
    created: Date,
    billablePeriod: {
    },
    disposition: String,
    provider: {
    },
    organization: {
    },
    facility: {
    },
    relatedClaim: [{
    }],
    prescription: {
    },
    originalPrescription: {
    },
    payee: {
        fhirType: {
            system: String,
            code: String,
            display: String
        },
        provider: {
        },
        organization: {
        },
        person: {
        }
    },
    referral: {
    },
    diagnosis: [{
        sequence: {
        },
        diagnosis: {
            system: String,
            code: String,
            display: String
        }
    }],
    specialCondition: [{
        system: String,
        code: String,
        display: String
    }],
    patient: {
    },
    precedence: {
    },
    coverage: {
        coverage: {
        },
        relationship: {
            system: String,
            code: String,
            display: String
        },
        preAuthRef: String,
    },
    exception: [{
        system: String,
        code: String,
        display: String
    }],
    school: String,
    accidentDate: Date,
    accidentType: {
        system: String,
        code: String,
        display: String
    },
    accidentLocationString: String,
    accidentLocationAddress: {
    },
    accidentLocationReference: {
    },
    interventionException: [{
        system: String,
        code: String,
        display: String
    }],
    onsetDate: Date,
    onsetPeriod: {
    },
    employmentImpacted: {
    },
    hospitalization: {
    },
    item: [{
        sequence: {
        },
        fhirType: {
            system: String,
            code: String,
            display: String
        },
        provider: {
        },
        diagnosisLinkId: [{
        }],
        service: {
            system: String,
            code: String,
            display: String
        },
        servicedDate: Date,
        servicedPeriod: {
        },
        place: {
            system: String,
            code: String,
            display: String
        },
        quantity: {
        },
        unitPrice: {
        },
        factor: Number,
        points: Number,
        net: {
        },
        udi: {
            system: String,
            code: String,
            display: String
        },
        bodySite: {
            system: String,
            code: String,
            display: String
        },
        subSite: [{
            system: String,
            code: String,
            display: String
        }],
        modifier: [{
            system: String,
            code: String,
            display: String
        }],
        noteNumber: [{
        }],
        adjudication: [{
            category: {
                system: String,
                code: String,
                display: String
            },
            reason: {
                system: String,
                code: String,
                display: String
            },
            amount: {
            },
            value: Number,
        }],
        detail: [{
            sequence: {
            },
            fhirType: {
                system: String,
                code: String,
                display: String
            },
            service: {
                system: String,
                code: String,
                display: String
            },
            quantity: {
            },
            unitPrice: {
            },
            factor: Number,
            points: Number,
            net: {
            },
            udi: {
                system: String,
                code: String,
                display: String
            },
            adjudication: [{
                code: {
                    system: String,
                    code: String,
                    display: String
                },
                reason: {
                    system: String,
                    code: String,
                    display: String
                },
                amount: {
                },
                value: Number,
            }],
            subDetail: [{
                sequence: {
                },
                fhirType: {
                    system: String,
                    code: String,
                    display: String
                },
                service: {
                    system: String,
                    code: String,
                    display: String
                },
                quantity: {
                },
                unitPrice: {
                },
                factor: Number,
                points: Number,
                net: {
                },
                udi: {
                    system: String,
                    code: String,
                    display: String
                },
                adjudication: [{
                    code: {
                        system: String,
                        code: String,
                        display: String
                    },
                    reason: {
                        system: String,
                        code: String,
                        display: String
                    },
                    amount: {
                    },
                    value: Number,
                }]
            }]
        }],
        prosthesis: {
            initial: Boolean,
            priorDate: Date,
            priorMaterial: {
                system: String,
                code: String,
                display: String
            }
        }
    }],
    addItem: [{
        sequenceLinkId: [{
        }],
        service: {
            system: String,
            code: String,
            display: String
        },
        fee: {
        },
        noteNumberLinkId: [{
        }],
        adjudication: [{
            code: {
                system: String,
                code: String,
                display: String
            },
            amount: {
            },
            value: Number,
        }],
        detail: [{
            service: {
                system: String,
                code: String,
                display: String
            },
            fee: {
            },
            adjudication: [{
                code: {
                    system: String,
                    code: String,
                    display: String
                },
                amount: {
                },
                value: Number,
            }]
        }]
    }],
    claimTotal: {
    },
    missingTeeth: [{
        tooth: {
            system: String,
            code: String,
            display: String
        },
        reason: {
            system: String,
            code: String,
            display: String
        },
        extractionDate: Date,
    }],
    unallocDeductable: {
    },
    totalBenefit: {
    },
    paymentAdjustment: {
    },
    paymentAdjustmentReason: {
        system: String,
        code: String,
        display: String
    },
    paymentDate: Date,
    paymentAmount: {
    },
    paymentRef: {
        use: String,
        label: String,
        system: String,
        value: String
    },
    reserved: {
        system: String,
        code: String,
        display: String
    },
    form: {
        system: String,
        code: String,
        display: String
    },
    note: [{
        number: {
        },
        fhirType: {
            system: String,
            code: String,
            display: String
        },
        text: String,
    }],
    benefitBalance: [{
        category: {
            system: String,
            code: String,
            display: String
        },
        subCategory: {
            system: String,
            code: String,
            display: String
        },
        network: {
            system: String,
            code: String,
            display: String
        },
        unit: {
            system: String,
            code: String,
            display: String
        },
        term: {
            system: String,
            code: String,
            display: String
        },
        financial: [{
            fhirType: {
                system: String,
                code: String,
                display: String
            },
            benefitUnsignedInt: {
            },
            benefitMoney: {
            },
            benefitUsedUnsignedInt: {
            },
            benefitUsedMoney: {
            }
        }]
    }]
});

mongoose.model('ExplanationOfBenefit', ExplanationOfBenefitSchema);
