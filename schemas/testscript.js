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

var TestScriptSchema = new mongoose.Schema({
    url: String,
    version: String,
    name: String,
    status: String,
    identifier: {
        use: String,
        label: String,
        system: String,
        value: String
    },
    experimental: Boolean,
    publisher: String,
    contact: [{
        name: String,
        telecom: [{
        }]
    }],
    date: Date,
    description: String,
    useContext: [{
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }],
    requirements: String,
    copyright: String,
    metadata: {
        link: [{
            url: String,
            description: String,
        }],
        capability: [{
            required: Boolean,
            validated: Boolean,
            description: String,
            origin: Number,
            destination: Number,
            link: String,
            conformance: {
            }
        }]
    },
    origin: [{
        index: Number,
        profile: String,
    }],
    destination: [{
        index: Number,
        profile: String,
    }],
    multiserver: Boolean,
    fixture: [{
        autocreate: Boolean,
        autodelete: Boolean,
        resource: {
        }
    }],
    profile: [{
    }],
    variable: [{
        name: String,
        defaultValue: String,
        headerField: String,
        path: String,
        sourceId: {
        }
    }],
    setup: {
        metadata: {
        },
        action: [{
            operation: {
                fhirType: {
                    system: String,
                    code: String,
                    display: String
                },
                resource: String,
                label: String,
                description: String,
                accept: String,
                contentType: String,
                destination: Number,
                encodeRequestUrl: Boolean,
                origin: Number,
                params: String,
                requestHeader: [{
                    field: String,
                    value: String,
                }],
                responseId: {
                },
                sourceId: {
                },
                targetId: {
                },
                url: String,
            },
            assert: {
                label: String,
                description: String,
                direction: String,
                compareToSourceId: String,
                compareToSourcePath: String,
                contentType: String,
                headerField: String,
                minimumId: String,
                navigationLinks: Boolean,
                operator: String,
                path: String,
                resource: String,
                response: String,
                responseCode: String,
                sourceId: {
                },
                validateProfileId: {
                },
                value: String,
                warningOnly: Boolean,
            }
        }]
    },
    test: [{
        name: String,
        description: String,
        metadata: {
        },
        action: [{
            operation: {
            },
            assert: {
            }
        }]
    }],
    teardown: {
        action: [{
            operation: {
            }
        }]
    }
});

mongoose.model('TestScript', TestScriptSchema);