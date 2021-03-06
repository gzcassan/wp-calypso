/** @format */
/**
 * External dependencies
 */
import React from 'react';
import { localize } from 'i18n-calypso';
import page from 'page';
import { initial, flatMap, trim } from 'lodash';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import Stream from 'reader/stream';
import CompactCard from 'components/card/compact';
import SearchInput from 'components/search';
import { recordTrack } from 'reader/stats';
import Suggestion from 'reader/search-stream/suggestion';
import SuggestionProvider from 'reader/search-stream/suggestion-provider';
import FollowingIntro from './intro';
import config from 'config';
import { getSearchPlaceholderText } from 'reader/search/utils';
import Banner from 'components/banner';
import { getCurrentUserCountryCode } from 'state/current-user/selectors';

function handleSearch( query ) {
	recordTrack( 'calypso_reader_search_from_following', {
		query,
	} );

	if ( trim( query ) !== '' ) {
		page( '/read/search?q=' + encodeURIComponent( query ) + '&focus=1' );
	}
}

const lastDayForVoteBanner = new Date( '2018-10-02T00:00:00' );

const FollowingStream = props => {
	const suggestionList =
		props.suggestions &&
		initial(
			flatMap( props.suggestions, query => [
				<Suggestion suggestion={ query.text } source="following" railcar={ query.railcar } />,
				', ',
			] )
		);
	const placeholderText = getSearchPlaceholderText();
	const now = new Date();
	const showRegistrationMsg = props.userInUSA && now < lastDayForVoteBanner;

	/* eslint-disable wpcalypso/jsx-classname-namespace */
	return (
		<Stream { ...props }>
			{ config.isEnabled( 'reader/following-intro' ) && <FollowingIntro /> }
			{ showRegistrationMsg && (
				<Banner
					className="following__reader-vote"
					title="The Internet can wait."
					callToAction="Be a Voter"
					description="Register to vote."
					dismissPreferenceName="reader-vote-register"
					event="reader-vote-register"
					href="https://iamavoter.turbovote.org/?r=wordpress"
					icon="star"
				/>
			) }
			<CompactCard className="following__search">
				<SearchInput
					onSearch={ handleSearch }
					delaySearch={ true }
					delayTimeout={ 500 }
					placeholder={ placeholderText }
				/>
			</CompactCard>
			<div className="search-stream__blank-suggestions">
				{ suggestionList &&
					props.translate( 'Suggestions: {{suggestions /}}.', {
						components: {
							suggestions: suggestionList,
						},
					} ) }
				&nbsp;
			</div>
		</Stream>
	);
	/* eslint-enable wpcalypso/jsx-classname-namespace */
};

export default connect( state => ( {
	userInUSA: getCurrentUserCountryCode( state ) === 'US',
} ) )( SuggestionProvider( localize( FollowingStream ) ) );
