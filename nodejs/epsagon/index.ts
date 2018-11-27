// Copyright 2016-2018, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as pulumi from "@pulumi/pulumi";

// Require an `iopipe:token` to be provided by the end-user.
const config = new pulumi.Config("epsagon");
const token = config.require("token");

export interface EpsagonConfig {
    appName?: string;
    metadataOnly?: boolean;
    useSSL?: boolean;
    traceCollectorURL?: string;
    isEpsagonDisabled?: boolean;
}

// Replace `pulumi.runtime.serializeFunction` and `pulumi.runtime.computeCodePaths` with wrappers which injects Epsagon
// around all serialized Pulumi functions.
export function install(pul: typeof pulumi, epsagonConfig: EpsagonConfig = {}) {
    const origSerializeFunction = pul.runtime.serializeFunction;
    pul.runtime.serializeFunction = function (func, args) {
        const wrapper =
            args && args.isFactoryFunction
                ? () => {
                    require("@epsagon/epsagon").init({
                        token,
                        appName: "pulumi",
                        metadataOnly: false,
                        ...epsagonConfig,
                    });

                    return require("epsagon").lambdaWrapper(func());
                }
                : () => {
                    require("epsagon").init({
                        token,
                        appName: "pulumi",
                        metadataOnly: false,
                        ...epsagonConfig,
                    });

                    return require("@epsagon/epsagon").lambdaWrapper(func);
                };
        return origSerializeFunction(wrapper, {...args, isFactoryFunction: true});
    };
    const originComputeCodePaths = pul.runtime.computeCodePaths;
    pul.runtime.computeCodePaths = function (extraIncludePaths, extraIncludePackages = [], extraExcludePackages) {
        // Make sure that `@epsagon/epsagon` is included in the uploaded package.
        const newExtraIncludePackages = [...extraIncludePackages, "@epsagon/epsagon"];
        return originComputeCodePaths(extraIncludePaths, newExtraIncludePackages, extraExcludePackages);
    };
}

// Attempt to install to the version of Pulumi we loaded
install(pulumi);

