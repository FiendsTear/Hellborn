import {Resource} from './ResourceList';
import {Loader} from 'pixi.js';

export default class ResourceManager extends Loader {
	loadedResources: Resource[];
	constructor() {
		super();
		this.loadedResources = [];
	}

	addResources(resourcesToLoad: Resource[]) {
		for (const resource of resourcesToLoad) {
			if (this.loadedResources.indexOf(resource) === -1) {
				this.add(resource.name, resource.url);
				this.loadedResources.push(resource);
			}
		}
		return this;
	}
}