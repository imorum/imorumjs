imorumjs.include("imorumjs.Helper",function(){
    // Plugin system
    imorumjs.Plugin = {
        repositoryFile : "repositories.xml",
        repositoryInfos : [],
        loadedComponents: []
    };

    imorumjs.Plugin.__getRepositoryInfo = function(url) {
        var storedInfo = null;
        imorumjs.sys.requestGet(this, url + 'repository.xml', function(url,
                response) {
            storedInfo = imorumjs.Helper.xml_str2json(response);
        });
        return storedInfo;
    }

    imorumjs.Plugin.__readRepoId = function(storedInfo) {
        return storedInfo.config.repositoryId;
    }

    imorumjs.Plugin.__readComponents = function(storedInfo) {
        var components = [];
        var arrComponents = storedInfo.config.components.component;
        imorumjs.Helper.processObjectOrArray(this, arrComponents, function(obj) {
            var versions = [];
            imorumjs.Helper.processObjectOrArray(this, obj.versions.version, function(obj) {
                versions.push(obj);
            }, function(arrVer, j) {
                versions.push(arrVer[j]);
            });
            components.push({
                'groupId' : obj.groupId,
                'componentId' : obj.componentId,
                'versions' : versions
            });
        }, function(arr, i) {
            var versions = [];
            imorumjs.Helper.processObjectOrArray(this, arr[i].versions.version, function(obj) {
                versions.push(obj);
            }, function(arrVer, j) {
                versions.push(arrVer[j]);
            });
            components.push({
                'groupId' : arr[i].groupId,
                'componentId' : arr[i].componentId,
                'versions' : versions
            });
        });
        return components;
    }

    imorumjs.Plugin.readRepositoryConfig = function(repositoryFile) {
        var storedConfig;
        if (repositoryFile == null)
            repositoryFile = imorumjs.Plugin.repositoryFile;
        imorumjs.sys.requestGet(
            this,
            repositoryFile,
            function(fileUrl, response) {
                storedConfig = imorumjs.Helper.xml_str2json(response);
                var arrRepos = storedConfig.repositories.url;
                imorumjs.Helper.processObjectOrArray(
                    this,
                    arrRepos,
                    function(obj) {
                        var storedInfo = imorumjs.Plugin
                                .__getRepositoryInfo(obj);
                        imorumjs.Plugin.repositoryInfos.push({
                            'id' : imorumjs.Plugin
                                    .__readRepoId(storedInfo),
                            'url' : obj,
                            'components' : imorumjs.Plugin
                                    .__readComponents(storedInfo)
                        });
                    },
                    function(arr, i) {
                        // check for duplication by url
                        var exist = false;
                        for ( var j = 0; j < imorumjs.Plugin.repositoryInfos.length; j++) {
                            if (imorumjs.Plugin.repositoryInfos[j].url == arr[i]) {
                                exist = true;
                                break;
                            }
                        }
                        if (!exist) {
                            // check again for duplication by id
                            var storedInfo = imorumjs.Plugin
                                    .__getRepositoryInfo(arr[i]);
                            var repositoryId = imorumjs.Plugin
                                    .__readRepoId(storedInfo);
                            for ( var j = 0; j < imorumjs.Plugin.repositoryInfos.length; j++) {
                                if (imorumjs.Plugin.repositoryInfos[j].id == repositoryId) {
                                    exist = true;
                                    break;
                                }
                            }
                            if (!exist) {
                                imorumjs.Plugin.repositoryInfos
                                        .push({
                                            'id' : repositoryId,
                                            'url' : arr[i],
                                            'components' : imorumjs.Plugin
                                                    .__readComponents(storedInfo)
                                        });
                            }
                        }
                    } // function(arr, i)
                );
            } // function(fileUrl, response)
        );
    }

    imorumjs.Plugin.registerComponent = function(componentId, version, dependencies, onDependenciesLoaded) {
        if(dependencies!=null)
        {
            for(var i=0; i<dependencies.length; i++){
                var loadedComponent = null;
                for(var j=0; j<this.loadedComponents.length; j++){
                    if(dependencies[i].id === this.loadedComponents[j].id){
                        loadedComponent=this.loadedComponents[j];
                        break;
                    }
                }
                if(loadedComponent === null){
                    imorumjs.Plugin.require(dependencies[i].id, dependencies[i].version);
                }else if(dependencies[i].version !== loadedComponent.version){
                    alert('Warning: Component ' + loadedComponent.id + ' is already loaded at version ' + loadedComponent.version +
                            '.\nDependant Component: ' + componentId + ' version ' + version );
                }
            }
        }
        // This should be called when all dependencies component have been loaded
        if(onDependenciesLoaded!=null){
            if(onDependenciesLoaded.call(this)){
                this.loadedComponents.push({'id': componentId, 'version': version});
            }
        }else{
            this.loadedComponents.push({'id': componentId, 'version': version});
        }
        // should check and call the dependant component onDependenciesLoaded
    }

    imorumjs.Plugin.require = function(componentId, version){
        // Auto-load component
        var repoInfos = imorumjs.Plugin.repositoryInfos;
        // search through all repositories
        for(var j=0; j<repoInfos.length; j++){
            // scan components
            var components = repoInfos[j].components;
            for(var k=0; k<components.length; k++){
                if(componentId === components[k].componentId){
                    var groupPath = components[k].groupId.replace(/\./g, '/');
                    var versions = components[k].versions;
                    var isVersionAvailable=false;
                    for(var v=0; v<versions.length; v++){
                        if(versions[v] === version){
                            isVersionAvailable=true;
                            break;
                        }
                    }
                    var versionToLoad = versions[0];
                    if(isVersionAvailable){
                        versionToLoad = version;
                    }else{
                        // TODO: find in other repository first
                        alert('Warning: Component ' + componentId + ' version ' + version + ' is not available, using version ' + versionToLoad + 'as default');
                    }
                    imorumjs.sys._appendJStoHead( repoInfos[j].url + groupPath + '/' + components[k].componentId + '/' + versionToLoad + '/' + components[k].componentId + '-' + versionToLoad + '.js');
                }
            }
        }
    }
});